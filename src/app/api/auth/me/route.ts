import { NextRequest, NextResponse } from 'next/server';
import { getUserFromrequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = getUserFromrequest(req);

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ user });
}
