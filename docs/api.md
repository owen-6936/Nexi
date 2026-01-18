# Nexi API Documentation

> Complete API reference for Nexi's backend services

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [RAG API](#rag-api)
4. [MCP API](#mcp-api)
5. [Plugin API](#plugin-api)
6. [Voice API](#voice-api)
7. [Translation API](#translation-api)
8. [User API](#user-api)
9. [WebSocket Events](#websocket-events)
10. [Error Handling](#error-handling)

## Overview

Base URL: `https://api.nexi.app/v1` (Development: `http://localhost:3000/api/v1`)

All API requests require authentication unless otherwise specified.

### Response Format

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-01-18T12:00:00Z"
}
```

### Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  },
  "timestamp": "2026-01-18T12:00:00Z"
}
```

## Authentication

### Login

**POST** `/auth/login`

```json
// Request
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Response
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Refresh Token

**POST** `/auth/refresh`

```json
// Request
{
  "refreshToken": "eyJhbGc..."
}

// Response
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### Headers

All authenticated requests must include:

```bash
Authorization: Bearer <accessToken>
```

## RAG API

### List Knowledge Bases

**GET** `/rag/knowledge-bases`

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "kb_123",
      "name": "Product Documentation",
      "description": "Technical product docs",
      "documentCount": 45,
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-18T09:30:00Z"
    }
  ]
}
```

### Create Knowledge Base

**POST** `/rag/knowledge-bases`

```json
// Request
{
  "name": "Customer Support KB",
  "description": "Customer support documentation",
  "settings": {
    "chunkSize": 1000,
    "chunkOverlap": 200
  }
}

// Response
{
  "success": true,
  "data": {
    "id": "kb_124",
    "name": "Customer Support KB",
    "description": "Customer support documentation",
    "documentCount": 0,
    "createdAt": "2026-01-18T12:00:00Z"
  }
}
```

### Upload Document

**POST** `/rag/knowledge-bases/:id/documents`

Content-Type: `multipart/form-data`

```bash
// Form Data
file: <binary>
metadata: {
  "title": "Installation Guide",
  "tags": ["setup", "installation"]
}

// Response
{
  "success": true,
  "data": {
    "documentId": "doc_456",
    "status": "processing",
    "fileName": "installation-guide.pdf",
    "size": 245760
  }
}
```

### Query Knowledge Base

**POST** `/rag/knowledge-bases/:id/query`

```json
// Request
{
  "question": "How do I install the application?",
  "topK": 5,
  "includeMetadata": true
}

// Response
{
  "success": true,
  "data": {
    "answer": "To install the application...",
    "sources": [
      {
        "documentId": "doc_456",
        "title": "Installation Guide",
        "chunk": "Installation steps: 1. Download...",
        "score": 0.95
      }
    ],
    "confidence": 0.92
  }
}
```

## MCP API

### List Available Models

**GET** `/mcp/models`

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "provider": "OpenAI",
      "capabilities": ["chat", "code", "analysis"],
      "contextWindow": 8192,
      "pricing": {
        "input": 0.03,
        "output": 0.06
      }
    }
  ]
}
```

### Send Message

**POST** `/mcp/chat`

```json
// Request
{
  "modelId": "gpt-4",
  "messages": [
    {
      "role": "user",
      "content": "Explain quantum computing"
    }
  ],
  "context": ["kb_123"],
  "settings": {
    "temperature": 0.7,
    "maxTokens": 1000
  }
}

// Response
{
  "success": true,
  "data": {
    "messageId": "msg_789",
    "content": "Quantum computing is...",
    "model": "gpt-4",
    "usage": {
      "promptTokens": 15,
      "completionTokens": 150,
      "totalTokens": 165
    }
  }
}
```

### Stream Message (SSE)

**POST** `/mcp/chat/stream`

```json
// Request (same as Send Message)

// Response (Server-Sent Events)
data: {"type":"start","messageId":"msg_790"}

data: {"type":"token","content":"Quantum"}

data: {"type":"token","content":" computing"}

data: {"type":"done","usage":{"totalTokens":165}}
```

## Plugin API

### List Plugins

**GET** `/plugins`

Query Parameters:

- `category`: Filter by category
- `isPremium`: true/false
- `search`: Search term

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "plugin_001",
      "name": "Advanced RAG",
      "description": "Enhanced RAG capabilities",
      "version": "1.2.0",
      "author": "Nexi Team",
      "isPremium": true,
      "price": 9.99,
      "category": "rag",
      "rating": 4.8,
      "downloads": 1234
    }
  ]
}
```

### Install Plugin

**POST** `/plugins/:id/install`

```json
// Response
{
  "success": true,
  "data": {
    "pluginId": "plugin_001",
    "status": "installed",
    "installedAt": "2026-01-18T12:30:00Z"
  }
}
```

### Activate Plugin

**POST** `/plugins/:id/activate`

```json
// Response
{
  "success": true,
  "data": {
    "pluginId": "plugin_001",
    "status": "active"
  }
}
```

### Plugin Settings

**GET** `/plugins/:id/settings`

```json
// Response
{
  "success": true,
  "data": {
    "settings": [
      {
        "key": "chunkSize",
        "label": "Chunk Size",
        "type": "number",
        "default": 1000,
        "min": 100,
        "max": 5000
      }
    ],
    "currentValues": {
      "chunkSize": 1200
    }
  }
}
```

**PUT** `/plugins/:id/settings`

```json
// Request
{
  "chunkSize": 1500
}

// Response
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

## Voice API

### Start Transcription

**POST** `/voice/transcribe`

Content-Type: `multipart/form-data`

```bash
// Form Data
audio: <binary>
language: "en"
model: "whisper-medium"

// Response
{
  "success": true,
  "data": {
    "transcriptionId": "trans_123",
    "text": "Hello, this is a test transcription",
    "confidence": 0.98,
    "language": "en",
    "duration": 5.2
  }
}
```

### Text-to-Speech

**POST** `/voice/tts`

```json
// Request
{
  "text": "Hello, how can I help you today?",
  "voice": "nova",
  "language": "en",
  "speed": 1.0
}

// Response
{
  "success": true,
  "data": {
    "audioUrl": "https://cdn.nexi.app/audio/abc123.mp3",
    "duration": 3.5,
    "format": "mp3"
  }
}
```

### Initiate Voice Call

**POST** `/voice/call/initiate`

```json
// Request
{
  "targetUserId": "user_456",
  "callType": "ai-assistant"
}

// Response
{
  "success": true,
  "data": {
    "callId": "call_789",
    "signaling": {
      "iceServers": [...],
      "offerSdp": "..."
    }
  }
}
```

## Translation API

### Translate Text

**POST** `/translation/translate`

```json
// Request
{
  "text": "Hello, how are you?",
  "sourceLang": "en",
  "targetLang": "es",
  "model": "nllb-200"
}

// Response
{
  "success": true,
  "data": {
    "translatedText": "Hola, ¿cómo estás?",
    "sourceLang": "en",
    "targetLang": "es",
    "confidence": 0.96
  }
}
```

### Detect Language

**POST** `/translation/detect`

```json
// Request
{
  "text": "Bonjour le monde"
}

// Response
{
  "success": true,
  "data": {
    "detectedLang": "fr",
    "confidence": 0.99,
    "alternatives": [
      { "lang": "fr", "confidence": 0.99 }
    ]
  }
}
```

## User API

### Get Current User

**GET** `/user/me`

```json
// Response
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://cdn.nexi.app/avatars/123.jpg",
    "plan": "free",
    "credits": 100,
    "preferences": {
      "theme": "dark",
      "language": "en"
    }
  }
}
```

### Update User Profile

**PATCH** `/user/me`

```json
// Request
{
  "name": "Jane Doe",
  "preferences": {
    "theme": "light"
  }
}

// Response
{
  "success": true,
  "data": {
    "updated": true
  }
}
```

### Get Usage Stats

**GET** `/user/usage`

```json
// Response
{
  "success": true,
  "data": {
    "period": "month",
    "credits": {
      "used": 250,
      "remaining": 750,
      "limit": 1000
    },
    "breakdown": {
      "rag": 100,
      "mcp": 120,
      "voice": 30
    }
  }
}
```

## WebSocket Events

Connect to: `wss://api.nexi.app/ws`

### Client → Server

```json
// Subscribe to updates
{
  "type": "subscribe",
  "channel": "rag:kb_123"
}

// Unsubscribe
{
  "type": "unsubscribe",
  "channel": "rag:kb_123"
}
```

### Server → Client

```json
// Document processing update
{
  "type": "rag:document:status",
  "data": {
    "documentId": "doc_456",
    "status": "completed",
    "progress": 100
  }
}

// Real-time message
{
  "type": "mcp:message",
  "data": {
    "messageId": "msg_789",
    "content": "Partial response...",
    "done": false
  }
}

// Voice call event
{
  "type": "voice:call:status",
  "data": {
    "callId": "call_789",
    "status": "connected"
  }
}
```

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

### Error Codes

| Code                             | Description                   |
| -------------------------------- | ----------------------------- |
| `AUTH_INVALID_CREDENTIALS`       | Invalid email or password     |
| `AUTH_TOKEN_EXPIRED`             | Access token expired          |
| `RAG_KB_NOT_FOUND`               | Knowledge base not found      |
| `RAG_DOCUMENT_PROCESSING_FAILED` | Document processing error     |
| `MCP_MODEL_NOT_AVAILABLE`        | Model temporarily unavailable |
| `PLUGIN_NOT_FOUND`               | Plugin does not exist         |
| `PLUGIN_INCOMPATIBLE`            | Plugin version incompatible   |
| `VOICE_TRANSCRIPTION_FAILED`     | Audio transcription error     |
| `RATE_LIMIT_EXCEEDED`            | Too many requests             |
| `INSUFFICIENT_CREDITS`           | Not enough credits            |

### Rate Limiting

Rate limits are enforced per endpoint:

- Authentication: 5 requests/minute
- RAG Queries: 20 requests/minute
- MCP Chat: 30 requests/minute
- Voice: 10 requests/minute

Headers returned:

```bash
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1642512000
```

---

For SDK documentation and code examples, see:

- [JavaScript/TypeScript SDK](./sdk-js.md)
- [Python SDK](./sdk-python.md)
- [Integration Examples](./examples.md)
