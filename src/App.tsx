import { MainLayout } from '@/components/layout';
import { Toaster } from '@/components/ui/sonner';
import {
    DashboardPage,
    LoginPage,
    MCPPage,
    PluginsPage,
    ProfilePage,
    RAGPage,
    RegisterPage,
    SettingsPage,
} from '@/pages';
import { useUIStore } from '@/store/uiStore';
import { useUserStore } from '@/store/userStore';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
    const { setTheme } = useUIStore();
    const { isAuthenticated } = useUserStore();

    useEffect(() => {
        // Set dark theme by default
        setTheme('dark');
    }, [setTheme]);

    return (
        <BrowserRouter>
            {!isAuthenticated ? (
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            ) : (
                <MainLayout>
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/rag" element={<RAGPage />} />
                        <Route path="/mcp" element={<MCPPage />} />
                        <Route path="/plugins" element={<PluginsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </MainLayout>
            )}
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
