import { GoogleGenerativeAI } from "@google/generative-ai";
import { query } from "./db";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Re-export generation tool for notes
export { generateNoteMetadata } from "./gemini";

// Helper to clean query
function extractKeywords(text: string): string[] {
    const stopWords = new Set(['what', 'is', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'my', 'your', 'his', 'her', 'their', 'this', 'that', 'it', 'tell', 'me', 'about', 'how', 'please', 'can', 'you']);
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => !stopWords.has(w) && (w.length > 2 || !isNaN(Number(w)))); // keep numbers like '10'
}

// New Chat Functionality
export async function generateChatAnswer(userId: string, question: string) {
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    // 1. Retrieve Relevant Notes
    // Strategy: Keyword extraction + OR matching to find ANY potentially relevant note.
    // The previous "%sentence%" required exact phrase match which failed for natural language.

    const keywords = extractKeywords(question);

    // Fallback if no keywords found (e.g. "??")
    let searchSql = '';
    let searchParams: any[] = [userId];

    if (keywords.length === 0) {
        // Fallback to sloppy broad match on whole string
        searchSql = `
            AND (
                title ILIKE $2 OR 
                summary ILIKE $2 OR 
                content ILIKE $2
            )
        `;
        searchParams.push(`%${question}%`);
    } else {
        // Construct SIMILAR TO pattern for ANY keyword match
        // Postgres SIMILAR TO syntax: '%(word1|word2|word3)%'
        const pattern = `%(${keywords.join('|')})%`;
        searchSql = `
            AND (
                title SIMILAR TO $2 OR 
                summary SIMILAR TO $2 OR 
                content SIMILAR TO $2 OR
                array_to_string(tags, ' ') SIMILAR TO $2
            )
        `;
        searchParams.push(pattern);
    }

    // Query DB
    const notesRes = await query(
        `SELECT id, title, summary, content 
         FROM notes 
         WHERE user_id = $1 
         ${searchSql}
         ORDER BY created_at DESC
         LIMIT 10`,
        searchParams
    );

    const notes = notesRes.rows;

    // Optional: Re-rank in JS (simple overlap count)
    // We want notes that contain MORE keywords to be higher in context
    if (keywords.length > 0) {
        notes.sort((a, b) => {
            const countA = keywords.filter(k => (a.title + a.content).toLowerCase().includes(k)).length;
            const countB = keywords.filter(k => (b.title + b.content).toLowerCase().includes(k)).length;
            return countB - countA;
        });
    }

    // Slice to top 5 for context window
    const topNotes = notes.slice(0, 5);

    if (topNotes.length === 0) {
        return {
            answer: "I don't have enough information in your notes to answer this.",
            sources: []
        };
    }

    // 2. Prepare Context
    const context = topNotes.map(n =>
        `Source ID: ${n.id}\nTitle: ${n.title}\nSummary: ${n.summary || "No summary"}\nContent Snippet: ${n.content.substring(0, 800)}...`
    ).join("\n\n---\n\n");

    // 3. Prompting Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
    You are a helpful assistant answering a user's question based strictly on their notes.
    
    USER QUESTION: "${question}"

    AVAILABLE NOTES:
    ${context}

    INSTRUCTIONS:
    1. Answer the question using ONLY the provided notes.
    2. If the answer is not in the notes, strictly say "I don't have enough information in your notes to answer this."
    3. Do not make up facts.
    4. Cite sources by referring to the Title if useful.
    5. Keep the answer concise and conversational.
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    // 4. Store Chat History
    const sourceIds = topNotes.map(n => n.id);

    await query(
        `INSERT INTO chats (user_id, question, answer, sources) VALUES ($1, $2, $3, $4)`,
        [userId, question, answer, sourceIds]
    );

    return {
        answer,
        sources: topNotes.map(n => ({ id: n.id, title: n.title }))
    };
}
