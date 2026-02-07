import { z } from 'zod';

// Collections
export const CreateCollectionSchema = z.object({
    name: z.string().min(1).max(100),
});

export const UpdateCollectionSchema = z.object({
    name: z.string().min(1).max(100),
});

// Notes
export const CreateNoteSchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    collectionId: z.string().optional(), // Assumes UUID string
    tags: z.array(z.string()).optional(),
    // Summary is system-generated later, but optional for manual override if needed
});

// Full update requires mandatory title/content, following strict PUT semantics
export const UpdateNoteSchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    collectionId: z.string().nullable().optional(),
    tags: z.array(z.string()).optional(),
});

// Chat
export const ChatSchema = z.object({
    question: z.string().min(1).max(500),
});
