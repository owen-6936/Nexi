import { create } from 'zustand';

/**
 * Credit System Architecture
 *
 * OVERVIEW:
 * - Free plan: 250 credits/month
 * - Premium plan: Unlimited credits
 * - Credits reset monthly on subscription renewal date
 *
 * CREDIT COSTS:
 * - Chat messages: 1 credit per message
 * - RAG queries: 2 credits per query
 * - Voice transcription (Whisper): 3 credits per minute
 * - Voice synthesis (TTS): 2 credits per minute
 * - Translation: 1 credit per 1000 characters
 * - Premium plugins: One-time cost (40-75 credits)
 * - Premium MCP servers: Included in premium plan
 *
 * BUSINESS MODEL:
 * - Freemium: Free tier with credit limit
 * - Premium: $9.99/month for unlimited credits
 * - Pay-as-you-go: $5 for 500 extra credits (free users only)
 *
 * IMPLEMENTATION:
 * - Track usage in real-time
 * - Block operations when credits exhausted (free tier)
 * - Show credit balance in UI
 * - Monthly reset via cron job
 * - Analytics dashboard for usage insights
 */

export interface CreditTransaction {
    id: string;
    userId: string;
    amount: number;
    type: 'debit' | 'credit';
    category: 'chat' | 'rag' | 'voice' | 'translation' | 'plugin' | 'refill' | 'reset';
    description: string;
    timestamp: Date;
    metadata?: {
        messageId?: string;
        pluginId?: string;
        duration?: number; // for voice features
        characterCount?: number; // for translation
    };
}

export interface CreditLimit {
    daily?: number;
    monthly: number;
    perOperation?: {
        chat?: number;
        rag?: number;
        voice?: number;
        translation?: number;
    };
}

export interface CreditPlan {
    name: 'free' | 'premium';
    monthlyCredits: number;
    isUnlimited: boolean;
    price: number; // in USD
    limits: CreditLimit;
}

interface CreditStore {
    plans: Record<string, CreditPlan>;
    transactions: CreditTransaction[];

    // Credit operations
    deductCredits: (
        userId: string,
        amount: number,
        category: CreditTransaction['category'],
        description: string,
        metadata?: CreditTransaction['metadata']
    ) => boolean;
    addCredits: (
        userId: string,
        amount: number,
        category: CreditTransaction['category'],
        description: string
    ) => void;
    checkCreditsAvailable: (userId: string, amount: number) => boolean;
    getTransactionHistory: (userId: string, limit?: number) => CreditTransaction[];
    getUserUsageStats: (userId: string) => {
        total: number;
        byCategory: Record<string, number>;
        thisMonth: number;
    };
}

export const useCreditStore = create<CreditStore>((set, get) => ({
    plans: {
        free: {
            name: 'free',
            monthlyCredits: 250,
            isUnlimited: false,
            price: 0,
            limits: {
                monthly: 250,
                perOperation: {
                    chat: 1,
                    rag: 2,
                    voice: 3,
                    translation: 1,
                },
            },
        },
        premium: {
            name: 'premium',
            monthlyCredits: Infinity,
            isUnlimited: true,
            price: 9.99,
            limits: {
                monthly: Infinity,
            },
        },
    },
    transactions: [],

    deductCredits: (userId, amount, category, description, metadata) => {
        // In production, this would check against user's actual credit balance
        // For now, we'll just record the transaction
        const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const transaction: CreditTransaction = {
            id,
            userId,
            amount,
            type: 'debit',
            category,
            description,
            timestamp: new Date(),
            metadata,
        };

        set((state) => ({
            transactions: [transaction, ...state.transactions],
        }));

        return true;
    },

    addCredits: (userId, amount, category, description) => {
        const id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const transaction: CreditTransaction = {
            id,
            userId,
            amount,
            type: 'credit',
            category,
            description,
            timestamp: new Date(),
        };

        set((state) => ({
            transactions: [transaction, ...state.transactions],
        }));
    },

    checkCreditsAvailable: (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _userId: string,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _amount: number
    ) => {
        // In production, check against user's actual balance from userStore
        // This is a simplified version
        return true;
    },

    getTransactionHistory: (userId, limit = 50) => {
        return get()
            .transactions.filter((t) => t.userId === userId)
            .slice(0, limit);
    },

    getUserUsageStats: (userId) => {
        const userTransactions = get().transactions.filter(
            (t) => t.userId === userId && t.type === 'debit'
        );

        const total = userTransactions.reduce((sum, t) => sum + t.amount, 0);

        const byCategory = userTransactions.reduce(
            (acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            },
            {} as Record<string, number>
        );

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonth = userTransactions
            .filter((t) => t.timestamp >= startOfMonth)
            .reduce((sum, t) => sum + t.amount, 0);

        return { total, byCategory, thisMonth };
    },
}));
