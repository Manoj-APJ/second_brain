'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MotionDiv, fadeIn, staggerContainer } from '@/components/motion';
import { Card, Button } from '@/components/ui';
import { Plus, Search, Tag, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/notes')
            .then(res => res.json())
            .then(data => {
                setNotes(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Good Morning</h1>
                    <p className="text-zinc-500 mt-2">Here's what's on your mind.</p>
                </div>
                <Link href="/notes/new">
                    <Button>
                        <Plus size={16} className="mr-2" />
                        New Note
                    </Button>
                </Link>
            </div>

            {/* Basic Filter Bar (Visual only for now) */}
            <div className="flex gap-2 pb-4 overflow-x-auto">
                <FilterButton active label="All Notes" />
                <FilterButton label="Ideas" />
                <FilterButton label="Journal" />
                <FilterButton label="Work" />
            </div>

            {/* Notes Grid */}
            {loading ? (
                <NotesSkeleton />
            ) : notes.length === 0 ? (
                <EmptyState />
            ) : (
                <MotionDiv variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((note) => (
                        <NoteCard key={note.id} note={note} />
                    ))}
                </MotionDiv>
            )}
        </div>
    );
}

function NoteCard({ note }: { note: any }) {
    return (
        <MotionDiv variants={fadeIn} whileHover={{ y: -2 }} className="h-full">
            <Link href={`/notes/${note.id}`}>
                <Card className="h-full flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors group cursor-pointer">
                    <div className="mb-3 flex justify-between items-start">
                        <h3 className="font-semibold text-zinc-900 line-clamp-1 group-hover:text-black dark:text-zinc-100 dark:group-hover:text-white">
                            {note.title}
                        </h3>
                        <span className="text-xs text-zinc-400 font-mono">
                            {new Date(note.created_at).toLocaleDateString()}
                        </span>
                    </div>

                    <p className="text-sm text-zinc-500 line-clamp-3 mb-4 flex-1">
                        {note.summary || note.content}
                    </p>

                    <div className="flex gap-2 mt-auto">
                        {note.tags?.slice(0, 3).map((tag: string) => (
                            <span key={tag} className="px-2 py-1 bg-zinc-100 text-[10px] font-medium text-zinc-600 rounded-md uppercase tracking-wider dark:bg-zinc-800 dark:text-zinc-400">
                                {tag}
                            </span>
                        ))}
                    </div>
                </Card>
            </Link>
        </MotionDiv>
    );
}

function FilterButton({ label, active }: { label: string, active?: boolean }) {
    return (
        <button className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${active ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-transparent text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'}`}>
            {label}
        </button>
    )
}

function EmptyState() {
    return (
        <div className="text-center py-20 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-4 dark:bg-zinc-800 dark:border-zinc-700">
                <FileText className="text-zinc-400" />
            </div>
            <h3 className="text-zinc-900 font-medium mb-1 dark:text-white">No notes yet</h3>
            <p className="text-zinc-500 text-sm mb-6">Capture your first thought to get started.</p>
            <Link href="/notes/new">
                <Button variant="secondary">Create Note</Button>
            </Link>
        </div>
    )
}

function NotesSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 rounded-xl bg-zinc-100 animate-pulse dark:bg-zinc-900" />
            ))}
        </div>
    )
}
