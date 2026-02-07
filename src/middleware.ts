import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define protected paths
    const protectedPaths = ['/api/notes', '/api/collections', '/api/chat'];

    const isProtected = protectedPaths.some(p => path.startsWith(p));

    if (isProtected) {
        const token = request.cookies.get('auth_token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Note: Full signature verification happens in the API route handler 
        // because jsonwebtoken is not fully compatible with Edge Runtime.
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/api/:path*',
    ],
};
