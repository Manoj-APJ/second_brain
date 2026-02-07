import Link from 'next/link';
import { Home, PlusSquare, MessageSquare, Settings, LogOut, Brain } from 'lucide-react';

export default function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-100 bg-zinc-50/50 backdrop-blur-xl hidden md:flex flex-col dark:bg-zinc-950 dark:border-zinc-800">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <Brain size={20} className="text-zinc-900 dark:text-white" />
                    <span className="font-semibold tracking-tight text-sm">Antigravity</span>
                </div>

                <nav className="space-y-1">
                    <NavLink href="/dashboard" icon={<Home size={18} />} label="Home" />
                    <NavLink href="/notes/new" icon={<PlusSquare size={18} />} label="New Note" />
                    <NavLink href="/chat" icon={<MessageSquare size={18} />} label="Ask Brain" />
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-zinc-100 dark:border-zinc-800">
                <button className="flex items-center gap-3 text-sm font-medium text-zinc-500 hover:text-red-600 transition-colors w-full">
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

function NavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-600 rounded-lg hover:bg-white hover:text-black hover:shadow-sm transition-all dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white">
            {icon}
            {label}
        </Link>
    )
}
