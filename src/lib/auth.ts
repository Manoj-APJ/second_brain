import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';

// Zod Schemas
export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

// Types
export interface JWTPayload {
    userId: string;
    email: string;
}

// Hashing
export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};

// JWT Utils
export const signToken = (payload: JWTPayload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // 7 days session
};

export const verifyToken = (token: string): JWTPayload | null => {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
};

// Request Helper
export const getUserFromrequest = (req: NextRequest) => {
    const token = req.cookies.get('auth_token')?.value;
    if (!token) return null;
    return verifyToken(token);
};
