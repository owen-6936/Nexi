import { MainLayout } from '@/components/layout';
import { Toaster } from '@/components/ui/sonner';
import { DashboardPage, ProfilePage } from '@/pages';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
    const { setTheme } = useUIStore();

    useEffect(() => {
        // Set dark theme by default
        setTheme('dark');
    }, [setTheme]);

    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/rag" element={<div>RAG Coming Soon</div>} />
                    <Route path="/mcp" element={<div>MCP Coming Soon</div>} />
                    <Route path="/plugins" element={<div>Plugins Coming Soon</div>} />
                    <Route path="/settings" element={<div>Settings Coming Soon</div>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </MainLayout>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
