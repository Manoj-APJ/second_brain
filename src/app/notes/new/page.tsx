'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MotionDiv, fadeIn } from '@/components/motion';
import { Button, Input, Textarea, Card } from '@/components/ui';
import Sidebar from '@/components/sidebar';
import { ArrowLeft, Save, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CreateNotePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            content: formData.get('content'),
            tags: [] // Tags handled by AI auto-tagging
        };

        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push('/dashboard');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Sidebar />
            <main className="md:pl-64 min-h-screen">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <MotionDiv initial="initial" animate="animate" variants={fadeIn}>

                        <div className="mb-8 flex items-center justify-between">
                            <Link href="/dashboard" className="text-zinc-400 hover:text-black transition-colors flex items-center gap-2 text-sm font-medium dark:hover:text-white">
                                <ArrowLeft size={16} />
                                Back to Dashboard
                            </Link>
                            <div className="flex items-center gap-2 text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full dark:bg-amber-900/30 dark:text-amber-400">
                                <Sparkles size={12} />
                                AI Auto-Tagging Enabled
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <input
                                    name="title"
                                    type="text"
                                    placeholder="Untitled Note"
                                    className="w-full text-4xl font-bold tracking-tight border-none outline-none placeholder:text-zinc-300 bg-transparent dark:placeholder:text-zinc-700 dark:text-white"
                                    autoFocus
                                    required
                                />

                                <textarea
                                    name="content"
                                    placeholder="Start writing..."
                                    className="w-full h-[60vh] resize-none text-lg leading-relaxed text-zinc-600 border-none outline-none placeholder:text-zinc-300 bg-transparent dark:text-zinc-300 dark:placeholder:text-zinc-800"
                                    required
                                />
                            </div>

                            <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12">
                                <Button size="lg" className="rounded-full shadow-xl" disabled={loading}>
                                    <Save size={18} className="mr-2" />
                                    {loading ? 'Saving...' : 'Save Note'}
                                </Button>
                            </div>
                        </form>

                    </MotionDiv>
                </div>
            </main>
        </div>
    );
}
