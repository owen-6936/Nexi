import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { useUIStore } from '@/store/uiStore';
import {
    Database,
    MessageSquare,
    PanelLeftClose,
    Plug,
    Plus,
    Settings,
    Trash2,
    User,
    Zap,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navigation = [
    { name: 'RAG', href: '/rag', icon: Database },
    { name: 'MCP', href: '/mcp', icon: Zap },
    { name: 'Plugins', href: '/plugins', icon: Plug },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { sidebarCollapsed, sidebarOpen, toggleSidebarCollapse, closeSidebar } = useUIStore();
    const {
        conversations,
        activeConversationId,
        createConversation,
        setActiveConversation,
        deleteConversation,
    } = useChatStore();

    // Close sidebar on mobile when route changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1024px)');
        if (mediaQuery.matches) {
            closeSidebar();
        }
    }, [location.pathname, closeSidebar]);

    const handleNewChat = () => {
        const newConvId = createConversation();
        setActiveConversation(newConvId);
        navigate('/');
    };

    const handleDeleteConversation = (e: React.MouseEvent, conversationId: string) => {
        e.preventDefault();
        e.stopPropagation();
        deleteConversation(conversationId);
    };

    return (
        <>
            {/* Backdrop for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-40 h-full bg-sidebar transition-all duration-300',
                    'flex flex-col',
                    'border-r-2 border-white/10',
                    sidebarCollapsed ? 'w-16' : 'w-64',
                    // Desktop: always visible
                    'lg:translate-x-0',
                    // Mobile: slide in/out
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    'max-lg:shadow-xl'
                )}
            >
                {/* Header with Logo and Close/Collapse Button */}
                <div className="h-16 flex items-center justify-between border-b border-sidebar-border px-4">
                    {!sidebarCollapsed ? (
                        <>
                            <Link
                                to="/"
                                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                Nexi
                            </Link>
                            <button
                                onClick={() => {
                                    // Desktop: collapse, Mobile: close
                                    const isDesktop =
                                        window.matchMedia('(min-width: 1024px)').matches;
                                    if (isDesktop) {
                                        toggleSidebarCollapse();
                                    } else {
                                        closeSidebar();
                                    }
                                }}
                                className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
                                aria-label="Collapse sidebar"
                            >
                                <PanelLeftClose className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={toggleSidebarCollapse}
                            className="text-xl font-bold text-primary mx-auto p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors"
                            aria-label="Expand sidebar"
                        >
                            N
                        </button>
                    )}
                </div>

                {/* New Chat Button */}
                {!sidebarCollapsed && (
                    <div className="p-3 border-b border-sidebar-border">
                        <button
                            onClick={handleNewChat}
                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border/50 hover:bg-sidebar-accent hover:border-border transition-all"
                        >
                            <Plus className="h-5 w-5 shrink-0" />
                            <span className="font-medium">New Chat</span>
                        </button>
                    </div>
                )}

                {/* Conversation History */}
                {!sidebarCollapsed && conversations.length > 0 && (
                    <div className="flex-1 overflow-y-auto scrollbar-custom">
                        <div className="px-3 py-2">
                            <h3 className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider px-3 mb-2">
                                Conversations
                            </h3>
                            <div className="space-y-1">
                                {conversations
                                    .slice()
                                    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                                    .map((conv) => (
                                        <button
                                            key={conv.id}
                                            onClick={() => {
                                                setActiveConversation(conv.id);
                                                navigate('/');
                                            }}
                                            className={cn(
                                                'w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all group',
                                                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                                activeConversationId === conv.id
                                                    ? 'bg-sidebar-accent/50 text-sidebar-foreground font-semibold shadow-sm'
                                                    : 'text-sidebar-foreground/70'
                                            )}
                                        >
                                            <MessageSquare className="h-4 w-4 shrink-0" />
                                            <span className="flex-1 text-left text-sm truncate">
                                                {conv.title}
                                            </span>
                                            <div
                                                onClick={(e) =>
                                                    handleDeleteConversation(e, conv.id)
                                                }
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-sidebar-border rounded transition-all cursor-pointer"
                                                role="button"
                                                aria-label="Delete conversation"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav
                    className={cn(
                        'px-3 py-4 space-y-1 border-t border-sidebar-border',
                        sidebarCollapsed && 'flex-1 overflow-y-auto scrollbar-custom'
                    )}
                >
                    {/* Chat link - only visible when collapsed */}
                    {sidebarCollapsed && (
                        <Link
                            to="/"
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                location.pathname === '/'
                                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                    : 'text-sidebar-foreground/70'
                            )}
                            title="Chat"
                        >
                            <MessageSquare className="h-5 w-5 shrink-0" />
                        </Link>
                    )}
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                    isActive
                                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                                        : 'text-sidebar-foreground/70'
                                )}
                                title={sidebarCollapsed ? item.name : undefined}
                            >
                                <Icon className="h-5 w-5 shrink-0" />
                                {!sidebarCollapsed && (
                                    <span className="font-medium">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="border-t border-sidebar-border p-3">
                    <Link
                        to="/profile"
                        className={cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                            'text-sidebar-foreground/70'
                        )}
                    >
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Profile</p>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Collapse toggle - bottom */}
                <button
                    onClick={toggleSidebarCollapse}
                    className="hidden lg:flex items-center justify-center h-10 border-t border-sidebar-border hover:bg-sidebar-accent transition-colors"
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Toggle sidebar width'}
                >
                    <div className="h-1 w-8 bg-sidebar-foreground/30 rounded-full" />
                </button>
            </aside>
        </>
    );
}
