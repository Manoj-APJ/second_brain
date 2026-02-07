import { NextRequest, NextResponse } from 'next/server';
import { getUserFromrequest } from '@/lib/auth';
import { ChatSchema } from '@/lib/validation';
import { generateChatAnswer } from '@/lib/chat';

export async function POST(req: NextRequest) {
    const user = getUserFromrequest(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const validation = ChatSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { question } = validation.data;

        const result = await generateChatAnswer(user.userId, question);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Something went wrong while processing your notes.' }, { status: 500 });
    }
}
