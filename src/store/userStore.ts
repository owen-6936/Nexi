import type { User } from '@/types';
import { create } from 'zustand';

interface UserStore {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    updateUser: (updates: Partial<User>) => void;
    clearUser: () => void;
    connectAccount: (platform: 'twitter' | 'telegram' | 'solanaWallet', identifier: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
    user: {
        id: '0xA3B250xA3_91b8',
        email: 'user@nexi.app',
        name: 'User',
        plan: 'free',
        credits: {
            used: 0,
            total: 10,
        },
        connectedAccounts: {},
    },
    isAuthenticated: true,

    setUser: (user) => set({ user, isAuthenticated: true }),

    updateUser: (updates) =>
        set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
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
