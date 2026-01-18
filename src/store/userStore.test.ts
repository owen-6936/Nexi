import { beforeEach, describe, expect, it } from 'vitest';
import { useUserStore } from './userStore';

describe('userStore', () => {
    beforeEach(() => {
        useUserStore.setState({
            user: {
                id: '0xA3B250xA3_91b8',
                email: 'user@nexi.app',
                name: 'User',
                plan: 'free',
                credits: { used: 0, total: 10 },
                connectedAccounts: {},
            },
            isAuthenticated: true,
        });
    });

    it('initializes with default user', () => {
        const { user, isAuthenticated } = useUserStore.getState();

        expect(isAuthenticated).toBe(true);
        expect(user).toBeDefined();
        expect(user?.plan).toBe('free');
    });

    it('updates user', () => {
        const { updateUser } = useUserStore.getState();

        updateUser({ name: 'John Doe' });

        const { user } = useUserStore.getState();
        expect(user?.name).toBe('John Doe');
    });

    it('connects account', () => {
        const { connectAccount } = useUserStore.getState();

        connectAccount('twitter', '@testuser');

        const { user } = useUserStore.getState();
        expect(user?.connectedAccounts.twitter).toBe('@testuser');
    });

    it('clears user', () => {
        const { clearUser } = useUserStore.getState();

        clearUser();

        const { user, isAuthenticated } = useUserStore.getState();
        expect(user).toBeNull();
        expect(isAuthenticated).toBe(false);
    });
});
