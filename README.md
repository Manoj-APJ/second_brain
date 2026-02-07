# AI-First Knowledge App

An AI-first knowledge system that lets users capture notes and **ask their own knowledge** through grounded, source-backed AI responses.

This project focuses on **clean architecture, security, and disciplined AI usage**, inspired by Mem.ai.

---

## Core Idea

**Ask your knowledge, don’t manage it.**

Users write freely. The system organizes and retrieves information using AI—without hallucinations.

---

## Features

- JWT + Google OAuth authentication
- Notes and collections CRUD (user-scoped)
- Async AI summarization and auto-tagging
- Grounded chat with notes (answers only from stored data)
- Source-attributed AI responses
- Token-efficient AI usage
- Simple, calm, responsive UI with subtle motion

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Framer Motion  
- **Backend**: Next.js API Routes (Node.js)  
- **Database**: PostgreSQL (Supabase)  
- **Auth**: JWT (stateless) + Google OAuth  
- **AI**: Gemini API (server-side only)

---

## AI Principles

- Uses only user-provided notes
- Returns “I don’t have enough information” when context is insufficient
- Summaries and tags are cached
- AI never blocks user actions

---

## Security

- JWT validation on all protected routes
- Strict user data isolation (`user_id` scoping)
- Passwords stored separately (`user_secrets`)
- No client-side AI calls
- No sensitive data exposed

---

## Status

Core functionality complete.  
Advanced features (vector search, public APIs, collaboration) intentionally excluded.

---

## Author

Manoj Mannam
