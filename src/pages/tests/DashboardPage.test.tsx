import { useChatStore } from '@/store/chatStore';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardPage } from '../DashboardPage';

// Mock the chat store
vi.mock('@/store/chatStore', () => ({
    useChatStore: vi.fn(),
}));

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = vi.fn();

describe('DashboardPage', () => {
    const mockCreateConversation = vi.fn();
    const mockAddMessage = vi.fn();
    const mockGetActiveConversation = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementation
        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            activeConversationId: null,
            conversations: [],
            createConversation: mockCreateConversation,
            addMessage: mockAddMessage,
            getActiveConversation: mockGetActiveConversation,
        });

        mockGetActiveConversation.mockReturnValue(null);
    });

    it('renders welcome state when no messages exist', () => {
        render(<DashboardPage />);

        expect(screen.getByText('Welcome to Nexi AI')).toBeInTheDocument();
        expect(screen.getByText('How can I help?')).toBeInTheDocument();
    });

    it('creates conversation on mount if none exists', () => {
        render(<DashboardPage />);

        expect(mockCreateConversation).toHaveBeenCalledTimes(1);
    });

    it('renders suggestion buttons', () => {
        render(<DashboardPage />);

        expect(screen.getByText('Explain quantum computing')).toBeInTheDocument();
        expect(screen.getByText('Write a Python function')).toBeInTheDocument();
        expect(screen.getByText('Translate this to Spanish')).toBeInTheDocument();
        expect(screen.getByText('Generate an image description')).toBeInTheDocument();
    });

    it('populates input when clicking suggestion', () => {
        render(<DashboardPage />);

        const suggestion = screen.getByText('Explain quantum computing');
        fireEvent.click(suggestion);

        const textarea = screen.getByPlaceholderText(/Message Nexi/i);
        expect(textarea).toHaveValue('Explain quantum computing');
    });

    it('sends message when clicking send button', async () => {
        const conversationId = 'conv_123';
        mockCreateConversation.mockReturnValue(conversationId);

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            activeConversationId: conversationId,
            conversations: [],
            createConversation: mockCreateConversation,
            addMessage: mockAddMessage,
            getActiveConversation: mockGetActiveConversation,
        });

        render(<DashboardPage />);

        const textarea = screen.getByPlaceholderText(/Message Nexi/i);
        const buttons = screen.getAllByRole('button');
        const sendButton = buttons[buttons.length - 1]; // Send button is the last button

        fireEvent.change(textarea, { target: { value: 'Hello AI' } });
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(mockAddMessage).toHaveBeenCalledWith(conversationId, {
                role: 'user',
                content: 'Hello AI',
            });
        });
    });

    it('displays messages when conversation has messages', () => {
        const mockConversation = {
            id: 'conv_123',
            title: 'Test Chat',
            messages: [
                {
                    id: 'msg_1',
                    role: 'user' as const,
                    content: 'Hello',
                    timestamp: new Date(),
                },
                {
                    id: 'msg_2',
                    role: 'assistant' as const,
                    content: 'Hi there!',
                    timestamp: new Date(),
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockGetActiveConversation.mockReturnValue(mockConversation);

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            activeConversationId: 'conv_123',
            conversations: [mockConversation],
            createConversation: mockCreateConversation,
            addMessage: mockAddMessage,
            getActiveConversation: mockGetActiveConversation,
        });

        render(<DashboardPage />);

        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
});
