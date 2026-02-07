import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { LoginSchema, verifyPassword, signToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = LoginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { email, password } = result.data;

        // Fetch User
        const userRes = await query('SELECT id, auth_provider FROM users WHERE email = $1', [email]);
        if (userRes.rowCount === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = userRes.rows[0];

        if (user.auth_provider !== 'email') {
            return NextResponse.json({ error: 'Please login with Google' }, { status: 403 });
        }

        // Fetch Secret (Auth Only)
        const secretRes = await query('SELECT password_hash FROM user_secrets WHERE user_id = $1', [user.id]);
        if (secretRes.rowCount === 0) {
            // Should not happen for email users
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const match = await verifyPassword(password, secretRes.rows[0].password_hash);
        if (!match) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Issue Token
        const token = signToken({ userId: user.id, email });

        // Set Cookie
        const cookie = serialize('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        const response = NextResponse.json({ success: true, userId: user.id });
        response.headers.set('Set-Cookie', cookie);
        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
