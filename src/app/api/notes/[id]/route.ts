import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromrequest } from '@/lib/auth';
import { UpdateNoteSchema } from '@/lib/validation';

interface RouteParams {
    params: {
        id: string;
    };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await query(
            'SELECT * FROM notes WHERE id = $1 AND user_id = $2',
            [params.id, user.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Get note error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const validation = UpdateNoteSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { title, content, collectionId, tags } = validation.data;

        // Strict PUT: defaults to null/empty if not provided, overwriting existing state
        const safeCollectionId = collectionId ?? null;
        const safeTags = tags ?? [];

        // Verify collection ownership if setting a collection
        if (safeCollectionId) {
            const colCheck = await query('SELECT 1 FROM collections WHERE id = $1 AND user_id = $2', [safeCollectionId, user.userId]);
            if (colCheck.rowCount === 0) {
                return NextResponse.json({ error: 'Invalid Collection' }, { status: 400 });
            }
        }

        const result = await query(
            `UPDATE notes 
       SET title = $1, content = $2, collection_id = $3, tags = $4 
       WHERE id = $5 AND user_id = $6 
       RETURNING *`,
            [title, content, safeCollectionId, safeTags, params.id, user.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Update note error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await query(
            'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
            [params.id, user.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete note error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
