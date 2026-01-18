import { useUIStore } from '@/store/uiStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('UIStore', () => {
    beforeEach(() => {
        // Reset store state
        useUIStore.setState({
            theme: 'dark',
            sidebarOpen: false,
            sidebarCollapsed: false,
        });
        localStorage.clear();
        document.documentElement.classList.remove('dark');
    });

    describe('theme management', () => {
        it('should have dark theme as default', () => {
            const { theme } = useUIStore.getState();
            expect(theme).toBe('dark');
        });

        it('should apply dark theme to document', () => {
            const { setTheme } = useUIStore.getState();
            setTheme('dark');
            expect(document.documentElement.classList.contains('dark')).toBe(true);
        });

        it('should remove dark class for light theme', () => {
            const { setTheme } = useUIStore.getState();
            setTheme('light');
            expect(document.documentElement.classList.contains('dark')).toBe(false);
        });

        it('should persist theme to localStorage', () => {
            const { setTheme } = useUIStore.getState();
            setTheme('light');
            expect(localStorage.getItem('nexi-theme')).toBe('light');
        });

        it('should apply system theme when set to system', () => {
            const { setTheme } = useUIStore.getState();
            setTheme('system');
            const { theme } = useUIStore.getState();
            expect(theme).toBe('system');
        });
    });

    describe('sidebar management', () => {
        it('should start with sidebar closed', () => {
            const { sidebarOpen } = useUIStore.getState();
            expect(sidebarOpen).toBe(false);
        });

        it('should toggle sidebar state', () => {
            const { toggleSidebar } = useUIStore.getState();
            toggleSidebar();
            expect(useUIStore.getState().sidebarOpen).toBe(true);
            toggleSidebar();
            expect(useUIStore.getState().sidebarOpen).toBe(false);
        });

        it('should close sidebar', () => {
            const { toggleSidebar, closeSidebar } = useUIStore.getState();
            toggleSidebar(); // Open it first
            closeSidebar();
            expect(useUIStore.getState().sidebarOpen).toBe(false);
        });

        it('should toggle sidebar collapse state', () => {
            const { toggleSidebarCollapse } = useUIStore.getState();
            toggleSidebarCollapse();
            expect(useUIStore.getState().sidebarCollapsed).toBe(true);
            toggleSidebarCollapse();
            expect(useUIStore.getState().sidebarCollapsed).toBe(false);
        });
    });
});
