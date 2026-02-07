'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MotionDiv, fadeIn } from '@/components/motion';
import { Button } from '@/components/ui';
import Sidebar from '@/components/sidebar';
import { ArrowLeft, Save, Trash2, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';

export default function NotePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [note, setNote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Fetch note
    useEffect(() => {
        fetch(`/api/notes/${params.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Note not found');
                return res.json();
            })
            .then(data => {
                setNote(data);
                setLoading(false);
            })
            .catch(() => router.push('/dashboard'));
    }, [params.id, router]);

    async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            content: formData.get('content'),
            // We persist existing tags/collection unless UI for them is added
            tags: note.tags,
            collectionId: note.collection_id
        };

        try {
            const res = await fetch(`/api/notes/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(data),
            });

            if (res.ok) {
                // success feedback (could be toast, here just visual)
                router.refresh();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this note?')) return;
        setDeleting(true);
        try {
            await fetch(`/api/notes/${params.id}`, { method: 'DELETE' });
            router.push('/dashboard');
        } catch (err) {
            setDeleting(false);
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-black flex">
            <Sidebar />
            <main className="md:pl-64 flex-1 p-12 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 bg-zinc-100 rounded-full mb-4 dark:bg-zinc-800" />
                    <div className="h-4 w-32 bg-zinc-100 rounded dark:bg-zinc-800" />
                </div>
            </main>
        </div>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Sidebar />
            <main className="md:pl-64 min-h-screen">
                <div className="max-w-3xl mx-auto px-6 py-12">
                    <MotionDiv initial="initial" animate="animate" variants={fadeIn}>

                        {/* Header Actions */}
                        <div className="mb-8 flex items-center justify-between">
                            <Link href="/dashboard" className="text-zinc-400 hover:text-black transition-colors flex items-center gap-2 text-sm font-medium dark:hover:text-white">
                                <ArrowLeft size={16} />
                                Back
                            </Link>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-zinc-400 font-mono mr-2">
                                    {new Date(note.updated_at).toLocaleDateString()}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* AI Metadata Display */}
                        {(note.tags?.length > 0 || note.summary) && (
                            <div className="mb-8 p-4 bg-zinc-50 rounded-xl border border-zinc-100 dark:bg-zinc-900/50 dark:border-zinc-800">
                                {note.summary && (
                                    <p className="text-sm text-zinc-500 mb-3 leading-relaxed italic border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
                                        {note.summary}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {note.tags?.map((tag: string) => (
                                        <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-zinc-200 rounded text-[10px] font-medium text-zinc-500 uppercase tracking-wider dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-400">
                                            <Tag size={10} />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleUpdate}>
                            <div className="space-y-6">
                                <input
                                    name="title"
                                    type="text"
                                    defaultValue={note.title}
                                    className="w-full text-4xl font-bold tracking-tight border-none outline-none placeholder:text-zinc-300 bg-transparent text-zinc-900 dark:text-white dark:placeholder:text-zinc-700"
                                    required
                                />

                                <textarea
                                    name="content"
                                    defaultValue={note.content}
                                    className="w-full h-[60vh] resize-none text-lg leading-relaxed text-zinc-600 border-none outline-none placeholder:text-zinc-300 bg-transparent dark:text-zinc-300 dark:placeholder:text-zinc-800"
                                    required
                                />
                            </div>

                            <div className="fixed bottom-6 right-6 md:bottom-12 md:right-12">
                                <Button size="lg" className="rounded-full shadow-xl" disabled={saving}>
                                    <Save size={18} className="mr-2" />
                                    {saving ? 'Saving...' : 'Update Note'}
                                </Button>
                            </div>
                        </form>

                    </MotionDiv>
                </div>
            </main>
        </div>
    );
}
