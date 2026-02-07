import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromrequest } from '@/lib/auth';
import { CreateCollectionSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await query(
            'SELECT id, name, created_at FROM collections WHERE user_id = $1 ORDER BY created_at DESC',
            [user.userId]
        );
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('List collections error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const validation = CreateCollectionSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { name } = validation.data;

        const result = await query(
            'INSERT INTO collections (user_id, name) VALUES ($1, $2) RETURNING id, name, created_at',
            [user.userId, name]
        );

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Create collection error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
