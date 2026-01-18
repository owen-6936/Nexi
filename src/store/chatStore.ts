import type { Conversation, Message } from '@/types/chat';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatStore {
    conversations: Conversation[];
    activeConversationId: string | null;

    // Actions
    createConversation: () => string;
    setActiveConversation: (id: string) => void;
    addMessage: (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    deleteConversation: (id: string) => void;
    updateConversationTitle: (id: string, title: string) => void;
    clearConversations: () => void;
    clearHistory: () => void;
    getActiveConversation: () => Conversation | null;
}

export const useChatStore = create<ChatStore>()(
    persist(
        (set, get) => ({
            conversations: [],
            activeConversationId: null,

            createConversation: () => {
                const id = `conv_${Date.now()}`;
                const newConversation: Conversation = {
                    id,
                    title: `Chat ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };

                set((state) => ({
                    conversations: [...state.conversations, newConversation],
                    activeConversationId: id,
                }));

                return id;
            },

            setActiveConversation: (id) => set({ activeConversationId: id }),

            addMessage: (conversationId, messageData) => {
                const message: Message = {
                    ...messageData,
                    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date(),
                };

                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === conversationId
                            ? {
                                  ...conv,
                                  messages: [...conv.messages, message],
                                  updatedAt: new Date(),
                                  title:
                                      conv.messages.length === 0
                                          ? messageData.content.slice(0, 50)
                                          : conv.title,
                              }
                            : conv
                    ),
                }));
            },

            deleteConversation: (id) =>
                set((state) => ({
                    conversations: state.conversations.filter((c) => c.id !== id),
                    activeConversationId:
                        state.activeConversationId === id ? null : state.activeConversationId,
                })),

            updateConversationTitle: (id, title) =>
                set((state) => ({
                    conversations: state.conversations.map((conv) =>
                        conv.id === id ? { ...conv, title, updatedAt: new Date() } : conv
                    ),
                })),

            clearConversations: () => set({ conversations: [], activeConversationId: null }),

            clearHistory: () => set({ conversations: [], activeConversationId: null }),

            getActiveConversation: () => {
                const state = get();
                return state.conversations.find((c) => c.id === state.activeConversationId) || null;
            },
        }),
        {
            name: 'nexi-chat-storage',
            version: 1,
        }
    )
);
