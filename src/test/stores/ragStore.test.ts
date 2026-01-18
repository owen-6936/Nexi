import { useRAGStore } from '@/store/ragStore';
import { beforeEach, describe, expect, it } from 'vitest';

describe('RAGStore', () => {
    beforeEach(() => {
        useRAGStore.setState({
            collections: [],
            documents: [],
            selectedCollectionId: null,
        });
    });

    describe('collection management', () => {
        it('should create a new collection', () => {
            const { createCollection } = useRAGStore.getState();
            createCollection('My Collection', 'Test description');

            const { collections } = useRAGStore.getState();
            expect(collections).toHaveLength(1);
            expect(collections[0].name).toBe('My Collection');
            expect(collections[0].description).toBe('Test description');
            expect(collections[0].documentCount).toBe(0);
        });

        it('should delete a collection', () => {
            const { createCollection, deleteCollection } = useRAGStore.getState();
            createCollection('Test Collection', 'Description');

            const collectionId = useRAGStore.getState().collections[0].id;
            deleteCollection(collectionId);

            expect(useRAGStore.getState().collections).toHaveLength(0);
        });

        it('should set selected collection', () => {
            const { createCollection, setSelectedCollection } = useRAGStore.getState();
            createCollection('Test Collection', 'Description');

            const collectionId = useRAGStore.getState().collections[0].id;
            setSelectedCollection(collectionId);

            expect(useRAGStore.getState().selectedCollectionId).toBe(collectionId);
        });
    });

    describe('document management', () => {
        it('should add document to collection', () => {
            const { createCollection, addDocument } = useRAGStore.getState();
            createCollection('Test Collection', 'Description');

            const collectionId = useRAGStore.getState().collections[0].id;
            addDocument(collectionId, 'My Document', 'Document content here');

            const { documents } = useRAGStore.getState();
            expect(documents).toHaveLength(1);
            expect(documents[0].name).toBe('My Document');
            expect(documents[0].collectionId).toBe(collectionId);
        });

        it('should update collection document count when adding document', () => {
            const { createCollection, addDocument } = useRAGStore.getState();
            createCollection('Test Collection', 'Description');

            const collectionId = useRAGStore.getState().collections[0].id;
            addDocument(collectionId, 'Doc 1', 'Content 1');
            addDocument(collectionId, 'Doc 2', 'Content 2');

            const collection = useRAGStore.getState().collections[0];
            expect(collection.documentCount).toBe(2);
        });

        it('should delete document from collection', () => {
            const { createCollection, addDocument, deleteDocument } = useRAGStore.getState();
            createCollection('Test Collection', 'Description');

            const collectionId = useRAGStore.getState().collections[0].id;
            addDocument(collectionId, 'My Document', 'Content');

            const documentId = useRAGStore.getState().documents[0].id;
            deleteDocument(documentId);

            expect(useRAGStore.getState().documents).toHaveLength(0);
        });

        it('should get documents by collection', () => {
            const { createCollection, addDocument, getDocumentsByCollection } =
                useRAGStore.getState();
            createCollection('Collection 1', 'Desc 1');
            createCollection('Collection 2', 'Desc 2');

            const col1Id = useRAGStore.getState().collections[0].id;
            const col2Id = useRAGStore.getState().collections[1].id;

            addDocument(col1Id, 'Doc 1', 'Content 1');
            addDocument(col1Id, 'Doc 2', 'Content 2');
            addDocument(col2Id, 'Doc 3', 'Content 3');

            const col1Docs = getDocumentsByCollection(col1Id);
            expect(col1Docs).toHaveLength(2);
            expect(col1Docs[0].name).toBe('Doc 1');
        });

        it('should calculate document size and chunks', () => {
            const { createCollection, addDocument } = useRAGStore.getState();
            createCollection('Test Collection', 'Description');

            const collectionId = useRAGStore.getState().collections[0].id;
            const content = 'A'.repeat(1000);
            addDocument(collectionId, 'Large Doc', content);

            const document = useRAGStore.getState().documents[0];
            expect(document.size).toBeGreaterThan(0);
            expect(document.chunks).toBeGreaterThan(0);
        });
    });
});
