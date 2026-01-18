import { create } from 'zustand';

interface UIStore {
    theme: 'dark' | 'light' | 'system';
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebarCollapse: () => void;
    setTheme: (theme: 'dark' | 'light' | 'system') => void;
}

const applyTheme = (theme: 'dark' | 'light' | 'system') => {
    if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    } else if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export const useUIStore = create<UIStore>((set) => ({
    theme: 'dark',
    sidebarOpen: false, // Start closed on mobile
    sidebarCollapsed: false,

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    closeSidebar: () => set({ sidebarOpen: false }),

    toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
        localStorage.setItem('nexi-theme', theme);
    },
}));

// Initialize theme from localStorage on load
const savedTheme = localStorage.getItem('nexi-theme') as 'dark' | 'light' | 'system' | null;
if (savedTheme) {
    useUIStore.setState({ theme: savedTheme });
    applyTheme(savedTheme);
}

// Listen for system theme changes when in system mode
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useUIStore.getState().theme;
    if (currentTheme === 'system') {
        applyTheme('system');
    }
});
