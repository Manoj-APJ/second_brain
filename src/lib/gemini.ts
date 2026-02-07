import { GoogleGenerativeAI } from "@google/generative-ai";
import { query } from "./db";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateNoteMetadata(noteId: string, title: string, content: string, userId: string) {
    if (!apiKey) {
        console.error("GEMINI_API_KEY is not set");
        return;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
      Analyze the following note and provide:
      1. A short summary (max 3 sentences).
      2. A list of 3-5 relevant tags (lowercase, single words).

      Note Title: ${title}
      Note Content: ${content}

      Output strictly in JSON format:
      {
        "summary": "string",
        "tags": ["string", "string"]
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(cleanText);

        if (data.summary && Array.isArray(data.tags)) {
            await query(
                `UPDATE notes SET summary = $1, tags = $2 WHERE id = $3 AND user_id = $4`,
                [data.summary, data.tags, noteId, userId]
            );
            console.log(`Updated metadata for note ${noteId}`);
        }

    } catch (error) {
        console.error("Error generating note metadata:", error);
        // Silent fail as per requirements ("Do NOT retry automatically")
    }
}
