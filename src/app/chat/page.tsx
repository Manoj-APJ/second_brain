'use client';
import { useState, useRef, useEffect } from 'react';
import { MotionDiv, fadeIn } from '@/components/motion';
import { Button, Input, Card } from '@/components/ui';
import Sidebar from '@/components/sidebar';
import { Send, User, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: any[];
}

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello. Ask me anything about your notes.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({ question: userMsg.content }),
            });
            const data = await res.json();

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer || "Sorry, I couldn't process that.",
                sources: data.sources
            };

            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black flex">
            <Sidebar />
            <main className="flex-1 flex flex-col h-screen md:pl-64">

                {/* Chat History */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                    <div className="max-w-3xl mx-auto space-y-8 pb-20">
                        {messages.map((msg) => (
                            <MotionDiv
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                                        <Sparkles size={14} className="text-amber-500" />
                                    </div>
                                )}

                                <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${msg.role === 'user'
                                        ? 'bg-black text-white dark:bg-white dark:text-black'
                                        : 'bg-white border border-zinc-100 shadow-sm text-zinc-700 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300'
                                    }`}>
                                    <p className="leading-relaxed">{msg.content}</p>

                                    {/* Sources Citation */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                            <p className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">Sources</p>
                                            <div className="flex flex-wrap gap-2">
                                                {msg.sources.map((src: any) => (
                                                    <span key={src.id} className="text-xs bg-zinc-50 border border-zinc-200 px-2 py-1 rounded text-zinc-500 dark:bg-zinc-900 dark:border-zinc-700">
                                                        {src.title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 dark:bg-white">
                                        <User size={14} className="text-white dark:text-black" />
                                    </div>
                                )}
                            </MotionDiv>
                        ))}

                        {loading && (
                            <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 dark:bg-zinc-900">
                                    <Sparkles size={14} className="text-zinc-400 animate-pulse" />
                                </div>
                                <div className="flex items-center gap-1 h-10 px-4">
                                    <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-zinc-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </MotionDiv>
                        )}
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-zinc-100 dark:bg-black dark:border-zinc-800">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSend} className="relative">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask anything..."
                                className="w-full h-14 pl-6 pr-14 rounded-full bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm placeholder:text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white dark:focus:ring-white/10"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-black transition-colors dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                            >
                                <Send size={18} />
                            </button>
                        </form>
                        <p className="text-center text-xs text-zinc-400 mt-3">Answers are grounded in your personal notes.</p>
                    </div>
                </div>

            </main>
        </div>
    );
}
