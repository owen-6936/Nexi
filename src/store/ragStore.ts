import { create } from 'zustand';

export interface Document {
    id: string;
    name: string;
    collectionId: string;
    content: string;
    size: number; // in bytes
    chunks: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Collection {
    id: string;
    name: string;
    description: string;
    documentCount: number;
    totalSize: number;
    createdAt: Date;
    updatedAt: Date;
}

interface RAGStore {
    collections: Collection[];
    documents: Document[];
    selectedCollectionId: string | null;

    // Collection operations
    createCollection: (name: string, description: string) => string;
    deleteCollection: (collectionId: string) => void;
    updateCollection: (collectionId: string, updates: Partial<Collection>) => void;
    setSelectedCollection: (collectionId: string | null) => void;

    // Document operations
    addDocument: (collectionId: string, name: string, content: string) => string;
    deleteDocument: (documentId: string) => void;
    updateDocument: (documentId: string, updates: Partial<Document>) => void;
    getDocumentsByCollection: (collectionId: string) => Document[];
    getCollection: (collectionId: string) => Collection | undefined;
}

export const useRAGStore = create<RAGStore>((set, get) => ({
    collections: [
        {
            id: 'programming',
            name: 'Programming',
            description: 'Programming languages and frameworks documentation',
            documentCount: 2,
            totalSize: 1024000,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
        },
        {
            id: 'ai-ml',
            name: 'AI & Machine Learning',
            description: 'Artificial Intelligence and Machine Learning resources',
            documentCount: 1,
            totalSize: 512000,
            createdAt: new Date('2024-01-16'),
            updatedAt: new Date('2024-01-16'),
        },
    ],
    documents: [
        {
            id: 'typescript_001',
            name: 'TypeScript Basics',
            collectionId: 'programming',
            content: 'TypeScript is a typed superset of JavaScript...',
            size: 512000,
            chunks: 45,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
        },
        {
            id: 'typescript_advanced',
            name: 'Advanced TypeScript',
            collectionId: 'programming',
            content: 'Advanced TypeScript features including generics...',
            size: 512000,
            chunks: 52,
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-01-15'),
        },
        {
            id: 'transformers_001',
            name: 'Transformer Architecture',
            collectionId: 'ai-ml',
            content: "The transformer architecture introduced in 'Attention is All You Need'...",
            size: 512000,
            chunks: 38,
            createdAt: new Date('2024-01-16'),
            updatedAt: new Date('2024-01-16'),
        },
    ],
    selectedCollectionId: null,

    createCollection: (name, description) => {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        const newCollection: Collection = {
            id,
            name,
            description,
            documentCount: 0,
            totalSize: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        set((state) => ({
            collections: [...state.collections, newCollection],
        }));

        return id;
    },

    deleteCollection: (collectionId) => {
        set((state) => ({
            collections: state.collections.filter((c) => c.id !== collectionId),
            documents: state.documents.filter((d) => d.collectionId !== collectionId),
            selectedCollectionId:
                state.selectedCollectionId === collectionId ? null : state.selectedCollectionId,
        }));
    },

    updateCollection: (collectionId, updates) => {
        set((state) => ({
            collections: state.collections.map((c) =>
                c.id === collectionId ? { ...c, ...updates, updatedAt: new Date() } : c
            ),
        }));
    },

    setSelectedCollection: (collectionId) => {
        set({ selectedCollectionId: collectionId });
    },

    addDocument: (collectionId, name, content) => {
        const collection = get().collections.find((c) => c.id === collectionId);
        if (!collection) throw new Error('Collection not found');

        // Generate document ID based on collection and name
        const baseId = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const existingDocs = get().documents.filter((d) => d.collectionId === collectionId);
        const counter = existingDocs.filter((d) => d.id.startsWith(baseId)).length + 1;
        const id = counter > 1 ? `${baseId}_${String(counter).padStart(3, '0')}` : baseId;

        const size = new Blob([content]).size;
        const chunks = Math.ceil(content.length / 500); // Rough estimate

        const newDocument: Document = {
            id,
            name,
            collectionId,
            content,
            size,
            chunks,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        set((state) => ({
            documents: [...state.documents, newDocument],
            collections: state.collections.map((c) =>
                c.id === collectionId
                    ? {
                          ...c,
                          documentCount: c.documentCount + 1,
                          totalSize: c.totalSize + size,
                          updatedAt: new Date(),
                      }
                    : c
            ),
        }));

        return id;
    },

    deleteDocument: (documentId) => {
        const doc = get().documents.find((d) => d.id === documentId);
        if (!doc) return;

        set((state) => ({
            documents: state.documents.filter((d) => d.id !== documentId),
            collections: state.collections.map((c) =>
                c.id === doc.collectionId
                    ? {
                          ...c,
                          documentCount: c.documentCount - 1,
                          totalSize: c.totalSize - doc.size,
                          updatedAt: new Date(),
                      }
                    : c
            ),
        }));
    },

    updateDocument: (documentId, updates) => {
        set((state) => ({
            documents: state.documents.map((d) =>
                d.id === documentId ? { ...d, ...updates, updatedAt: new Date() } : d
            ),
        }));
    },

    getDocumentsByCollection: (collectionId) => {
        return get().documents.filter((d) => d.collectionId === collectionId);
    },

    getCollection: (collectionId) => {
        return get().collections.find((c) => c.id === collectionId);
    },
}));
