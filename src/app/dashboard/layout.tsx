import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white dark:bg-black">
            <Sidebar />
            <main className="md:pl-64 min-h-screen">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
