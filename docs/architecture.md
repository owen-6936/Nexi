# Nexi Architecture

> Comprehensive guide to Nexi's system architecture and design decisions

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [State Management](#state-management)
5. [Component Architecture](#component-architecture)
6. [Data Flow](#data-flow)
7. [Plugin System](#plugin-system)
8. [RAG System](#rag-system)
9. [MCP Integration](#mcp-integration)
10. [Voice & Real-time Features](#voice--real-time-features)

## Overview

Nexi is built with a modern, scalable architecture focusing on:

- **Modularity**: Independent, reusable components
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized rendering and data fetching
- **Extensibility**: Plugin-based architecture
- **Real-time**: WebSocket and WebRTC integration

## System Architecture

```bash
┌─────────────────────────────────────────────────────────┐
│                     Nexi Frontend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   React UI   │  │   3D Layer   │  │  Voice Call  │  │
│  │   (shadcn)   │  │  (Three.js)  │  │   (WebRTC)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │            State Management (Zustand)             │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Services   │  │    Plugins   │  │     MCP      │  │
│  │   (Axios)    │  │   (Dynamic)  │  │  (Protocol)  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend Services                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   RAG API    │  │  Whisper AI  │  │   NLLB TTS   │  │
│  │  (Vector DB) │  │  (Speech)    │  │ (Translation)│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Tech Stack Layers

1. **Presentation Layer**
   - React 19 components
   - shadcn/ui components
   - Tailwind CSS styling
   - Framer Motion animations

2. **Business Logic Layer**
   - Custom hooks
   - Service abstractions
   - Plugin interfaces

3. **Data Layer**
   - Zustand stores
   - TanStack Query cache
   - WebSocket connections

### Directory Structure

```bash
src/
├── components/
│   ├── ui/              # Base UI components (shadcn)
│   ├── features/        # Feature-specific components
│   │   ├── rag/
│   │   ├── plugins/
│   │   ├── voice/
│   │   └── mcp/
│   └── layout/          # Layout components
│       ├── Header/
│       ├── Sidebar/
│       └── MainLayout/
├── pages/               # Route pages
│   ├── Dashboard/
│   ├── Plugins/
│   ├── Settings/
│   └── VoiceCall/
├── hooks/               # Custom hooks
│   ├── useRAG.ts
│   ├── usePlugin.ts
│   ├── useVoice.ts
│   └── useMCP.ts
├── store/               # Zustand stores
│   ├── userStore.ts
│   ├── pluginStore.ts
│   ├── ragStore.ts
│   └── mcpStore.ts
├── services/            # External integrations
│   ├── api/
│   ├── websocket/
│   ├── webrtc/
│   └── plugins/
├── lib/                 # Utilities
│   ├── utils.ts
│   ├── validators.ts
│   └── formatters.ts
└── types/               # TypeScript types
    ├── api.ts
    ├── plugin.ts
    ├── rag.ts
    └── mcp.ts
```

## State Management

### Zustand Store Pattern

We use Zustand for lightweight, performant state management.

```typescript
// Example: Plugin Store
import { create } from "zustand";
import { Plugin } from "@/types/plugin";

interface PluginStore {
  plugins: Plugin[];
  activePlugins: string[];

  // Actions
  loadPlugins: () => Promise<void>;
  activatePlugin: (id: string) => void;
  deactivatePlugin: (id: string) => void;
}

export const usePluginStore = create<PluginStore>((set, get) => ({
  plugins: [],
  activePlugins: [],

  loadPlugins: async () => {
    const plugins = await fetchPlugins();
    set({ plugins });
  },

  activatePlugin: (id) => {
    set((state) => ({
      activePlugins: [...state.activePlugins, id],
    }));
  },

  deactivatePlugin: (id) => {
    set((state) => ({
      activePlugins: state.activePlugins.filter((p) => p !== id),
    }));
  },
}));
```

### Store Organization

- **userStore** - Authentication & user data
- **pluginStore** - Plugin management
- **ragStore** - RAG configuration & knowledge bases
- **mcpStore** - MCP models & contexts
- **uiStore** - UI state (modals, sidebars, themes)
- **voiceStore** - Voice call state & settings

## Component Architecture

### Component Types

1. **UI Components** (`/components/ui`)
   - Reusable, atomic components
   - From shadcn/ui library
   - No business logic

2. **Feature Components** (`/components/features`)
   - Feature-specific logic
   - Composed from UI components
   - Connect to stores/hooks

3. **Layout Components** (`/components/layout`)
   - Page structure
   - Navigation
   - Responsive layouts

### Example Component Structure

```typescript
// components/features/rag/DocumentUpload.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRAG } from '@/hooks/useRAG';
import { toast } from 'sonner';

interface DocumentUploadProps {
  onUploadComplete?: () => void;
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const { uploadDocument } = useRAG();

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await uploadDocument(file);
      toast.success('Document uploaded successfully');
      onUploadComplete?.();
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Implementation */}
    </div>
  );
}
```

## Data Flow

### Server State (TanStack Query)

```typescript
// hooks/useRAG.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRAG() {
  const queryClient = useQueryClient();

  // Fetch knowledge bases
  const { data: knowledgeBases } = useQuery({
    queryKey: ["knowledgeBases"],
    queryFn: fetchKnowledgeBases,
  });

  // Upload document mutation
  const uploadDocument = useMutation({
    mutationFn: (file: File) => uploadDocumentAPI(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBases"] });
    },
  });

  return {
    knowledgeBases,
    uploadDocument: uploadDocument.mutate,
  };
}
```

### Client State (Zustand)

Used for:

- UI state (modals, sidebars)
- User preferences
- Active selections
- Temporary data

### Real-time State (WebSocket)

```typescript
// services/websocket/socket.ts
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_WS_URL, {
  autoConnect: false,
});

// hooks/useSocket.ts
import { useEffect } from "react";
import { socket } from "@/services/websocket/socket";

export function useSocket(event: string, handler: (data: any) => void) {
  useEffect(() => {
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [event, handler]);
}
```

## Plugin System

### Plugin Architecture

Plugins are dynamically loaded modules that extend Nexi's functionality.

```typescript
// types/plugin.ts
export interface Plugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  isPremium: boolean;

  // Plugin lifecycle
  init: () => Promise<void>;
  activate: () => void;
  deactivate: () => void;

  // Plugin API
  getActions: () => PluginAction[];
  getSettings: () => PluginSetting[];
}

export interface PluginAction {
  id: string;
  label: string;
  icon: string;
  execute: () => void;
}
```

### Plugin Loading

```typescript
// services/plugins/loader.ts
export async function loadPlugin(url: string): Promise<Plugin> {
  const module = await import(/* @vite-ignore */ url);
  return module.default as Plugin;
}
```

## RAG System

### Architecture

```bash
Document Input → Chunking → Embedding → Vector DB
                                           ↓
User Query → Embedding → Similarity Search → Context
                                              ↓
                                    LLM + Context → Response
```

### Implementation

```typescript
// services/rag/ragService.ts
export class RAGService {
  async ingestDocument(file: File) {
    const text = await extractText(file);
    const chunks = chunkText(text);
    const embeddings = await generateEmbeddings(chunks);
    await storeInVectorDB(embeddings);
  }

  async query(question: string) {
    const embedding = await generateEmbedding(question);
    const context = await searchVectorDB(embedding);
    return generateResponse(question, context);
  }
}
```

## MCP Integration

Model Context Protocol allows switching between AI models seamlessly.

```typescript
// types/mcp.ts
export interface MCPModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
}

// services/mcp/mcpService.ts
export class MCPService {
  async sendMessage(model: string, message: string, context: string[]) {
    return await fetch(`/api/mcp/${model}`, {
      method: "POST",
      body: JSON.stringify({ message, context }),
    });
  }
}
```

## Voice & Real-time Features

### WebRTC Voice Calls

```typescript
// services/webrtc/voiceCall.ts
export class VoiceCallService {
  private peerConnection: RTCPeerConnection;

  async startCall(peerId: string) {
    this.peerConnection = new RTCPeerConnection(config);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, stream);
    });
  }
}
```

### Whisper Integration

```typescript
// services/ai/whisper.ts
export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const response = await fetch("/api/whisper/transcribe", {
    method: "POST",
    body: formData,
  });

  return response.json();
}
```

## Performance Optimizations

1. **Code Splitting**
   - Route-based splitting
   - Dynamic plugin loading

2. **Memoization**
   - React.memo for expensive components
   - useMemo for computed values

3. **Virtual Scrolling**
   - For long plugin lists
   - For chat histories

4. **Debouncing**
   - Search inputs
   - Auto-save features

## Security Considerations

1. **Plugin Sandboxing**
   - Isolated execution contexts
   - Permission system

2. **API Authentication**
   - JWT tokens
   - Refresh token rotation

3. **Data Validation**
   - Zod schemas
   - Runtime type checking

## Testing Strategy

1. **Unit Tests**
   - All utilities and services
   - Store logic

2. **Component Tests**
   - User interactions
   - State changes

3. **Integration Tests**
   - Feature workflows
   - API integrations

4. **E2E Tests** (Future)
   - Critical user paths
   - Plugin installation

---

For more details on specific subsystems, see:

- [Plugin Development Guide](./plugins.md)
- [API Documentation](./api.md)
- [Testing Guide](./testing.md)
