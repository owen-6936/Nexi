import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useRAGStore } from '@/store/ragStore';
import { Database, FileText, Plus, Trash2, Upload } from 'lucide-react';
import { useState } from 'react';

export function RAGPage() {
    const {
        collections,
        selectedCollectionId,
        setSelectedCollection,
        createCollection,
        deleteCollection,
        addDocument,
        deleteDocument,
        getDocumentsByCollection,
    } = useRAGStore();

    const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
    const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [newCollectionDesc, setNewCollectionDesc] = useState('');
    const [newDocumentName, setNewDocumentName] = useState('');
    const [newDocumentContent, setNewDocumentContent] = useState('');

    const selectedCollection = collections.find((c) => c.id === selectedCollectionId);
    const collectionDocuments = selectedCollectionId
        ? getDocumentsByCollection(selectedCollectionId)
        : [];

    const handleCreateCollection = () => {
        if (!newCollectionName.trim()) return;
        createCollection(newCollectionName, newCollectionDesc);
        setNewCollectionName('');
        setNewCollectionDesc('');
        setIsAddCollectionOpen(false);
    };

    const handleAddDocument = () => {
        if (!selectedCollectionId || !newDocumentName.trim() || !newDocumentContent.trim()) return;
        addDocument(selectedCollectionId, newDocumentName, newDocumentContent);
        setNewDocumentName('');
        setNewDocumentContent('');
        setIsAddDocumentOpen(false);
    };

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
    };

    return (
        <div className="h-full flex gap-6 p-6">
            {/* Collections Sidebar */}
            <div className="w-80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Database className="h-5 w-5 text-primary" />
                        Collections
                    </h2>
                    <Dialog open={isAddCollectionOpen} onOpenChange={setIsAddCollectionOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-1" />
                                New
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Collection</DialogTitle>
                                <DialogDescription>
                                    Create a new collection to organize your documents
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label htmlFor="collection-name">Name</Label>
                                    <Input
                                        id="collection-name"
                                        value={newCollectionName}
                                        onChange={(e) => setNewCollectionName(e.target.value)}
                                        placeholder="e.g., Programming"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="collection-desc">Description</Label>
                                    <Textarea
                                        id="collection-desc"
                                        value={newCollectionDesc}
                                        onChange={(e) => setNewCollectionDesc(e.target.value)}
                                        placeholder="Brief description of this collection"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setIsAddCollectionOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateCollection}>Create</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {collections.map((collection) => (
                        <Card
                            key={collection.id}
                            className={cn(
                                'cursor-pointer transition-all hover:bg-sidebar-accent border-2',
                                selectedCollectionId === collection.id
                                    ? 'border-primary bg-sidebar-accent/50'
                                    : 'border-white/10'
                            )}
                            onClick={() => setSelectedCollection(collection.id)}
                        >
                            <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <CardTitle className="text-sm truncate">
                                            {collection.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs mt-1 line-clamp-2">
                                            {collection.description}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-7 w-7 shrink-0 ml-2 text-muted-foreground hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCollection(collection.id);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                    <span>{collection.documentCount} docs</span>
                                    <span>{formatBytes(collection.totalSize)}</span>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Documents Area */}
            <div className="flex-1 flex flex-col gap-4">
                {selectedCollection ? (
                    <>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedCollection.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    {selectedCollection.description}
                                </p>
                            </div>
                            <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Add Document
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Add Document</DialogTitle>
                                        <DialogDescription>
                                            Add a new document to {selectedCollection.name}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div>
                                            <Label htmlFor="doc-name">Document Name</Label>
                                            <Input
                                                id="doc-name"
                                                value={newDocumentName}
                                                onChange={(e) => setNewDocumentName(e.target.value)}
                                                placeholder="e.g., TypeScript Basics"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="doc-content">Content</Label>
                                            <Textarea
                                                id="doc-content"
                                                value={newDocumentContent}
                                                onChange={(e) =>
                                                    setNewDocumentContent(e.target.value)
                                                }
                                                placeholder="Paste or type your document content here..."
                                                rows={12}
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsAddDocumentOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button onClick={handleAddDocument}>Add Document</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Documents Grid */}
                        <div className="flex-1 overflow-y-auto scrollbar-custom">
                            {collectionDocuments.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {collectionDocuments.map((doc) => (
                                        <Card
                                            key={doc.id}
                                            className="border-2 border-white/10 hover:border-white/20 transition-all"
                                        >
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <FileText className="h-4 w-4 text-primary shrink-0" />
                                                            <CardTitle className="text-sm truncate">
                                                                {doc.name}
                                                            </CardTitle>
                                                        </div>
                                                        <code className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                                                            {doc.id}
                                                        </code>
                                                    </div>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-7 w-7 shrink-0 ml-2 text-muted-foreground hover:text-destructive"
                                                        onClick={() => deleteDocument(doc.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <p className="text-xs text-muted-foreground line-clamp-3">
                                                    {doc.content}
                                                </p>
                                                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                                                    <span>{doc.chunks} chunks</span>
                                                    <span>{formatBytes(doc.size)}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center">
                                    <div className="text-center space-y-3">
                                        <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                                        <div>
                                            <h3 className="font-semibold">No documents yet</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Add your first document to get started
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-3">
                            <Database className="h-12 w-12 text-muted-foreground mx-auto" />
                            <div>
                                <h3 className="font-semibold">Select a collection</h3>
                                <p className="text-sm text-muted-foreground">
                                    Choose a collection to view its documents
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
