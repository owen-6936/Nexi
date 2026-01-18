import { useUserStore } from '@/store/userStore';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { ProfilePage } from './ProfilePage';

describe('ProfilePage', () => {
    beforeEach(() => {
        useUserStore.setState({
            user: {
                id: '0xA3B250xA3_91b8',
                email: 'user@nexi.app',
                name: 'TestUser',
                plan: 'free',
                credits: { used: 0, total: 10 },
                connectedAccounts: {},
            },
            isAuthenticated: true,
        });
    });

    it('renders user profile information', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        expect(screen.getByText('0xA3B250xA3_91b8')).toBeInTheDocument();
        expect(screen.getByText('user@nexi.app')).toBeInTheDocument();
    });

    it('displays credits correctly', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        expect(screen.getByText('0')).toBeInTheDocument();
        expect(screen.getByText('/10')).toBeInTheDocument();
    });

    it('displays plan information', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        expect(screen.getAllByText('Free Plan').length).toBeGreaterThan(0);
        expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument();
    });

    it('renders account linking options', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        expect(screen.getByText('GitHub')).toBeInTheDocument();
        expect(screen.getByText('Google')).toBeInTheDocument();
        expect(screen.getByText('Link your accounts')).toBeInTheDocument();
    });
});
