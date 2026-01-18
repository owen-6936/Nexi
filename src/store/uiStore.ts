import { create } from 'zustand';

interface UIStore {
    theme: 'dark' | 'light';
    sidebarOpen: boolean;
    sidebarCollapsed: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebarCollapse: () => void;
    setTheme: (theme: 'dark' | 'light') => void;
}

export const useUIStore = create<UIStore>((set) => ({
    theme: 'dark',
    sidebarOpen: false, // Start closed on mobile
    sidebarCollapsed: false,

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    closeSidebar: () => set({ sidebarOpen: false }),

    toggleSidebarCollapse: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

    setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    },
}));
