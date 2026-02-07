'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MotionDiv, fadeIn } from '@/components/motion';
import { Button, Input, Card } from '@/components/ui';
import { Brain } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const json = await res.json();
                setError(json.error || 'Login failed');
            }
        } catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <MotionDiv initial="initial" animate="animate" variants={fadeIn} className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-zinc-200 shadow-sm mb-4 dark:bg-zinc-900 dark:border-zinc-800">
                        <Brain size={24} className="text-zinc-900 dark:text-white" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Welcome back</h2>
                    <p className="text-zinc-500 text-sm mt-2">Enter your credentials to access your brain</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Email</label>
                            <Input name="email" type="email" required placeholder="you@example.com" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-zinc-500 mb-1.5 block">Password</label>
                            <Input name="password" type="password" required placeholder="••••••••" />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-zinc-400 dark:bg-zinc-900">Or continue with</span>
                            </div>
                        </div>

                        <Button type="button" variant="secondary" className="w-full" onClick={() => alert('Google Auth requires client ID configuration')}>
                            Google
                        </Button>
                    </form>
                </Card>

                <p className="text-center text-sm text-zinc-500 mt-6">
                    Don't have an account? <Link href="/signup" className="text-zinc-900 font-medium hover:underline dark:text-white">Sign up</Link>
                </p>
            </MotionDiv>
        </div>
    );
}
