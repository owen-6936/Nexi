import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from '../Sidebar';

// Mock the stores
vi.mock('@/store/uiStore');
vi.mock('@/store/chatStore');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('Sidebar', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock useUIStore
        (useUIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            sidebarCollapsed: false,
            sidebarOpen: true,
            toggleSidebarCollapse: vi.fn(),
            closeSidebar: vi.fn(),
        });

        // Mock useChatStore
        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            conversations: [],
            activeConversationId: null,
            createConversation: vi.fn(() => 'conv_123'),
            setActiveConversation: vi.fn(),
            deleteConversation: vi.fn(),
        });
    });

    it('renders logo and navigation items', () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(screen.getByText('Nexi')).toBeInTheDocument();
        expect(screen.getByText('RAG')).toBeInTheDocument();
        expect(screen.getByText('MCP')).toBeInTheDocument();
        expect(screen.getByText('Plugins')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders new chat button', () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(screen.getByText('New Chat')).toBeInTheDocument();
    });

    it('creates new conversation when new chat button is clicked', () => {
        const createConversation = vi.fn(() => 'conv_123');
        const setActiveConversation = vi.fn();
        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            conversations: [],
            activeConversationId: null,
            createConversation,
            setActiveConversation,
            deleteConversation: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        const newChatButton = screen.getByText('New Chat');
        fireEvent.click(newChatButton);

        expect(createConversation).toHaveBeenCalled();
        expect(setActiveConversation).toHaveBeenCalledWith('conv_123');
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('renders close button', () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        const closeButton = screen.getByLabelText('Collapse sidebar');
        expect(closeButton).toBeInTheDocument();
    });

    it('closes sidebar when close button is clicked', () => {
        const toggleSidebarCollapse = vi.fn();
        (useUIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            sidebarCollapsed: false,
            sidebarOpen: true,
            toggleSidebarCollapse,
            closeSidebar: vi.fn(),
        });

        // Mock desktop viewport
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation((query) => ({
                matches: query === '(min-width: 1024px)',
                media: query,
                onchange: null,
                addListener: vi.fn(),
                removeListener: vi.fn(),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        const closeButton = screen.getByLabelText('Collapse sidebar');
        fireEvent.click(closeButton);

        expect(toggleSidebarCollapse).toHaveBeenCalled();
    });

    it('renders conversation history when conversations exist', () => {
        const mockConversations = [
            {
                id: 'conv_1',
                title: 'Test Chat 1',
                messages: [],
                createdAt: new Date('2026-01-15'),
                updatedAt: new Date('2026-01-15'),
            },
            {
                id: 'conv_2',
                title: 'Test Chat 2',
                messages: [],
                createdAt: new Date('2026-01-16'),
                updatedAt: new Date('2026-01-16'),
            },
        ];

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            conversations: mockConversations,
            activeConversationId: 'conv_1',
            createConversation: vi.fn(),
            setActiveConversation: vi.fn(),
            deleteConversation: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(screen.getByText('Conversations')).toBeInTheDocument();
        expect(screen.getByText('Test Chat 1')).toBeInTheDocument();
        expect(screen.getByText('Test Chat 2')).toBeInTheDocument();
    });

    it('activates conversation when clicked', () => {
        const setActiveConversation = vi.fn();
        const mockConversations = [
            {
                id: 'conv_1',
                title: 'Test Chat',
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            conversations: mockConversations,
            activeConversationId: null,
            createConversation: vi.fn(),
            setActiveConversation,
            deleteConversation: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        const conversationButton = screen.getByText('Test Chat');
        fireEvent.click(conversationButton);

        expect(setActiveConversation).toHaveBeenCalledWith('conv_1');
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deletes conversation when delete button is clicked', () => {
        const deleteConversation = vi.fn();
        const mockConversations = [
            {
                id: 'conv_1',
                title: 'Test Chat',
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            conversations: mockConversations,
            activeConversationId: null,
            createConversation: vi.fn(),
            setActiveConversation: vi.fn(),
            deleteConversation,
        });

        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        const deleteButtons = screen.getAllByLabelText('Delete conversation');
        fireEvent.click(deleteButtons[0]);

        expect(deleteConversation).toHaveBeenCalledWith('conv_1');
    });

    it('hides conversation history and new chat button when collapsed', () => {
        (useUIStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            sidebarCollapsed: true,
            sidebarOpen: true,
            toggleSidebarCollapse: vi.fn(),
            closeSidebar: vi.fn(),
        });

        const mockConversations = [
            {
                id: 'conv_1',
                title: 'Test Chat',
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            conversations: mockConversations,
            activeConversationId: null,
            createConversation: vi.fn(),
            setActiveConversation: vi.fn(),
            deleteConversation: vi.fn(),
        });

        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(screen.queryByText('New Chat')).not.toBeInTheDocument();
        expect(screen.queryByText('Conversations')).not.toBeInTheDocument();
        expect(screen.queryByText('Test Chat')).not.toBeInTheDocument();
    });
});
