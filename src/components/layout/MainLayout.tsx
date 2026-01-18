import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { type ReactNode, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const { sidebarCollapsed, sidebarOpen } = useUIStore();

    // Open sidebar by default on desktop
    useEffect(() => {
        const handleResize = () => {
            const mediaQuery = window.matchMedia('(min-width: 1024px)');
            if (mediaQuery.matches && !sidebarOpen) {
                // On desktop, ensure sidebar is visible on first load
                useUIStore.setState({ sidebarOpen: true });
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="h-screen flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
            <Sidebar />
            <Header />

            <main
                className={cn(
                    'pt-24 flex-1 transition-all duration-300 overflow-hidden',
                    sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
                )}
            >
                {children}
            </main>
        </div>
    );
}
