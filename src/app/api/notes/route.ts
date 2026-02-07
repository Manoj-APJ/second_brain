import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromrequest } from '@/lib/auth';
import { CreateNoteSchema } from '@/lib/validation';
import { generateNoteMetadata } from '@/lib/gemini';

export async function GET(req: NextRequest) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get('collectionId');
    const tag = searchParams.get('tag');

    try {
        let queryText = `
      SELECT id, collection_id, title, content, summary, tags, created_at, updated_at 
      FROM notes 
      WHERE user_id = $1
    `;
        const queryParams: any[] = [user.userId];
        let paramIndex = 2;

        if (collectionId) {
            queryText += ` AND collection_id = $${paramIndex}`;
            queryParams.push(collectionId);
            paramIndex++;
        }

        if (tag) {
            // Postgres array contains check
            queryText += ` AND $${paramIndex} = ANY(tags)`;
            queryParams.push(tag);
            paramIndex++;
        }

        queryText += ` ORDER BY created_at DESC`;

        const result = await query(queryText, queryParams);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('List notes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const validation = CreateNoteSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { title, content, collectionId, tags } = validation.data;

        // Optional: Verify collection ownership if collectionId provided
        if (collectionId) {
            const colParams = [collectionId, user.userId];
            const colRes = await query('SELECT id FROM collections WHERE id = $1 AND user_id = $2', colParams);
            if (colRes.rowCount === 0) {
                return NextResponse.json({ error: 'Invalid Collection ID' }, { status: 400 });
            }
        }

        const result = await query(
            `INSERT INTO notes (user_id, collection_id, title, content, tags) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
            [user.userId, collectionId || null, title, content, tags || []]
        );

        const newNote = result.rows[0];

        // Fire-and-forget AI processing
        generateNoteMetadata(newNote.id, newNote.title, newNote.content, user.userId);

        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error('Create note error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
