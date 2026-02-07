import { Pool, PoolConfig } from 'pg';

const globalForDb = globalThis as unknown as {
    conn: Pool | undefined;
};

// Supabase requires SSL for external connections
const poolConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    max: 10, // Limit connections for serverless environments
    ssl: {
        rejectUnauthorized: false, // Required for Supabase self-signed certs or pooled connections
    },
};

const conn = globalForDb.conn ?? new Pool(poolConfig);

if (process.env.NODE_ENV !== 'production') globalForDb.conn = conn;

export const db = conn;

// Helper for simple queries
export const query = async (text: string, params?: any[]) => {
    const client = await db.connect();
    try {
        return await client.query(text, params);
    } finally {
        client.release();
    }
};
