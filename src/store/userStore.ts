import type { User } from '@/types';
import { create } from 'zustand';

interface UserStore {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    updateUser: (updates: Partial<User>) => void;
    updateCredits: (used: number) => void;
    clearUser: () => void;
    connectAccount: (platform: 'github' | 'google', identifier: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: true }),

    updateUser: (updates) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
        })),

    updateCredits: (used) =>
        set((state) => ({
            user: state.user ? { ...state.user, credits: { ...state.user.credits, used } } : null,
        })),

    clearUser: () => set({ user: null, isAuthenticated: false }),

    connectAccount: (platform, identifier) =>
        set((state) => ({
            user: state.user
                ? {
                      ...state.user,
                      connectedAccounts: {
                          ...state.user.connectedAccounts,
                          [platform]: identifier,
                      },
                  }
                : null,
        })),
}));
