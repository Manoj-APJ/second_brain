import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromrequest } from '@/lib/auth';
import { UpdateCollectionSchema } from '@/lib/validation';

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
            'SELECT id, name, created_at FROM collections WHERE id = $1 AND user_id = $2',
            [params.id, user.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Get collection error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const validation = UpdateCollectionSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { name } = validation.data;

        const result = await query(
            'UPDATE collections SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING id, name, created_at',
            [name, params.id, user.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Update collection error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const result = await query(
            'DELETE FROM collections WHERE id = $1 AND user_id = $2 RETURNING id',
            [params.id, user.userId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete collection error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
