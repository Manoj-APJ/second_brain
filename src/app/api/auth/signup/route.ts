import { NextRequest, NextResponse } from 'next/server';
import { db, query } from '@/lib/db';
import { SignupSchema, hashPassword, signToken } from '@/lib/auth';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = SignupSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }

        const { email, password } = result.data;

        // Check existing user
        const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rowCount && existing.rowCount > 0) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await hashPassword(password);

        // Transaction
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const userRes = await client.query(
                `INSERT INTO users (email, auth_provider) VALUES ($1, 'email') RETURNING id`,
                [email]
            );
            const userId = userRes.rows[0].id;

            await client.query(
                `INSERT INTO user_secrets (user_id, password_hash) VALUES ($1, $2)`,
                [userId, hashedPassword]
            );

            await client.query('COMMIT');

            // Issue Token
            const token = signToken({ userId, email });

            // Set Cookie
            const cookie = serialize('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

            const response = NextResponse.json({ success: true, userId });
            response.headers.set('Set-Cookie', cookie);
            return response;

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
