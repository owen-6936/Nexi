export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    plan: 'free' | 'premium';
    credits: {
        used: number;
        total: number;
    };
    connectedAccounts: {
        twitter?: string;
        telegram?: string;
        solanaWallet?: string;
    };
}

export interface Plugin {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
    isPremium: boolean;
    price?: number;
    category: 'rag' | 'mcp' | 'voice' | 'translation' | 'utility';
    icon: string;
    isActive: boolean;
}

export interface KnowledgeBase {
    id: string;
    name: string;
    description: string;
    documentCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface MCPModel {
    id: string;
    name: string;
    provider: string;
    capabilities: string[];
    contextWindow: number;
}
