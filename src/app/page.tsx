import Link from 'next/link';
import { ArrowRight, Brain, Sparkles, Terminal, Activity } from 'lucide-react';
import { MotionDiv, MotionMain, fadeIn } from '@/components/motion';

export default function LandingPage() {
    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 flex flex-col">
            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 dark:bg-zinc-950/80 dark:border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white dark:bg-zinc-100 dark:text-black">
                            <Brain size={18} />
                        </div>
                        <span className="font-semibold text-lg tracking-tight">Antigravity Note</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link href="/signup" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors shadow-sm dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <MotionMain
                initial="initial"
                animate="animate"
                variants={fadeIn}
                className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 max-w-5xl mx-auto text-center"
            >
                <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400">
                    <Sparkles size={12} className="text-amber-500" />
                    <span>AI-First Knowledge Management</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">
                    Ask your knowledge,<br /> don't manage it.
                </h1>

                <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 leading-relaxed">
                    The calmest way to capture thoughts.
                    Automatic tagging, instant summaries, and a chat interface that actually knows your notes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link href="/signup" className="group h-12 px-8 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                        Start Writing
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link href="/login" className="h-12 px-8 bg-white border border-zinc-200 text-zinc-900 rounded-xl font-medium flex items-center justify-center hover:bg-zinc-50 transition-colors dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-800">
                        Live Demo
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 text-left w-full">
                    <FeatureCard
                        icon={<Terminal size={20} />}
                        title="Capture Fast"
                        description="Minimal editor designed for speed. Just type, we handle organization."
                    />
                    <FeatureCard
                        icon={<Sparkles size={20} />}
                        title="AI Grounding"
                        description="Chat with your notes. No hallucinations, just answers from your brain."
                    />
                    <FeatureCard
                        icon={<Activity size={20} />}
                        title="Zero Maintenance"
                        description="Auto-tagging and summarization happens instantly on save."
                    />
                </div>

            </MotionMain>

            <footer className="border-t border-zinc-100 py-12 text-center text-sm text-zinc-400 dark:border-zinc-800">
                <p>© 2026 Antigravity Note. Built consistent with your rules.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors dark:bg-zinc-900/50 dark:border-zinc-800/100">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm mb-4 border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white text-zinc-900">
                {icon}
            </div>
            <h3 className="font-semibold text-zinc-900 mb-2 dark:text-white">{title}</h3>
            <p className="text-zinc-500 leading-relaxed text-sm dark:text-zinc-400">{description}</p>
        </div>
    )
}
