import { create } from 'zustand';

export interface Plugin {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    category: string;
    isPremium: boolean;
    isInstalled: boolean;
    isEnabled: boolean;
    icon?: string;
    price?: number; // in credits
    downloads: number;
    rating: number;
    lastUpdated: Date;
}

interface PluginStore {
    plugins: Plugin[];
    installedPlugins: Plugin[];
    searchQuery: string;
    selectedCategory: string | null;

    // Plugin operations
    installPlugin: (pluginId: string) => void;
    uninstallPlugin: (pluginId: string) => void;
    togglePlugin: (pluginId: string) => void;
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;
    getPlugin: (pluginId: string) => Plugin | undefined;
    getFilteredPlugins: () => Plugin[];
}

export const usePluginStore = create<PluginStore>((set, get) => ({
    plugins: [
        {
            id: 'code-formatter',
            name: 'Code Formatter',
            description: 'Automatically format code in multiple languages with customizable rules',
            version: '2.1.0',
            author: 'DevTools Inc',
            category: 'Development',
            isPremium: false,
            isInstalled: true,
            isEnabled: true,
            icon: '🎨',
            downloads: 15420,
            rating: 4.8,
            lastUpdated: new Date('2024-01-15'),
        },
        {
            id: 'advanced-rag',
            name: 'Advanced RAG',
            description:
                'Enhanced RAG capabilities with semantic search and multi-modal embeddings',
            version: '1.5.2',
            author: 'AI Labs',
            category: 'AI',
            isPremium: true,
            isInstalled: false,
            isEnabled: false,
            price: 50,
            icon: '🧠',
            downloads: 8932,
            rating: 4.9,
            lastUpdated: new Date('2024-01-18'),
        },
        {
            id: 'voice-enhanced',
            name: 'Voice Enhanced',
            description: 'Premium voice features with emotion detection and voice cloning',
            version: '3.0.1',
            author: 'VoiceAI Co',
            category: 'Voice',
            isPremium: true,
            isInstalled: true,
            isEnabled: false,
            price: 75,
            icon: '🎤',
            downloads: 12045,
            rating: 4.7,
            lastUpdated: new Date('2024-01-17'),
        },
        {
            id: 'translation-pro',
            name: 'Translation Pro',
            description: 'Professional translation with context awareness and terminology support',
            version: '2.3.0',
            author: 'LangTech',
            category: 'Translation',
            isPremium: true,
            isInstalled: false,
            isEnabled: false,
            price: 40,
            icon: '🌐',
            downloads: 9876,
            rating: 4.6,
            lastUpdated: new Date('2024-01-16'),
        },
        {
            id: 'markdown-preview',
            name: 'Markdown Preview',
            description: 'Live markdown preview with syntax highlighting and export options',
            version: '1.8.0',
            author: 'OpenSource Collective',
            category: 'Productivity',
            isPremium: false,
            isInstalled: true,
            isEnabled: true,
            icon: '📝',
            downloads: 23456,
            rating: 4.5,
            lastUpdated: new Date('2024-01-14'),
        },
        {
            id: 'api-explorer',
            name: 'API Explorer',
            description: 'Interactive API testing and documentation explorer',
            version: '1.2.4',
            author: 'DevTools Inc',
            category: 'Development',
            isPremium: false,
            isInstalled: false,
            isEnabled: false,
            icon: '🔌',
            downloads: 7654,
            rating: 4.4,
            lastUpdated: new Date('2024-01-13'),
        },
        {
            id: 'analytics-dashboard',
            name: 'Analytics Dashboard',
            description: 'Advanced analytics and usage insights with custom reports',
            version: '2.0.0',
            author: 'DataViz Pro',
            category: 'Analytics',
            isPremium: true,
            isInstalled: false,
            isEnabled: false,
            price: 60,
            icon: '📊',
            downloads: 5432,
            rating: 4.8,
            lastUpdated: new Date('2024-01-12'),
        },
        {
            id: 'git-integration',
            name: 'Git Integration',
            description: 'Seamless Git workflow integration with commit assistant',
            version: '1.9.1',
            author: 'OpenSource Collective',
            category: 'Development',
            isPremium: false,
            isInstalled: true,
            isEnabled: true,
            icon: '🔀',
            downloads: 18765,
            rating: 4.7,
            lastUpdated: new Date('2024-01-11'),
        },
    ],
    installedPlugins: [],
    searchQuery: '',
    selectedCategory: null,

    installPlugin: (pluginId) => {
        const plugin = get().plugins.find((p) => p.id === pluginId);
        if (!plugin || plugin.isInstalled) return;

        set((state) => ({
            plugins: state.plugins.map((p) =>
                p.id === pluginId ? { ...p, isInstalled: true, isEnabled: true } : p
            ),
        }));
    },

    uninstallPlugin: (pluginId) => {
        set((state) => ({
            plugins: state.plugins.map((p) =>
                p.id === pluginId ? { ...p, isInstalled: false, isEnabled: false } : p
            ),
        }));
    },

    togglePlugin: (pluginId) => {
        set((state) => ({
            plugins: state.plugins.map((p) =>
                p.id === pluginId && p.isInstalled ? { ...p, isEnabled: !p.isEnabled } : p
            ),
        }));
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query });
    },

    setSelectedCategory: (category) => {
        set({ selectedCategory: category });
    },

    getPlugin: (pluginId) => {
        return get().plugins.find((p) => p.id === pluginId);
    },

    getFilteredPlugins: () => {
        const { plugins, searchQuery, selectedCategory } = get();

        return plugins.filter((plugin) => {
            const matchesSearch =
                !searchQuery ||
                plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                plugin.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = !selectedCategory || plugin.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    },
}));
