# Plugin Development Guide

> Learn how to create plugins for Nexi

## Table of Contents

1. [Introduction](#introduction)
2. [Plugin Architecture](#plugin-architecture)
3. [Getting Started](#getting-started)
4. [Plugin API Reference](#plugin-api-reference)
5. [Plugin Types](#plugin-types)
6. [Best Practices](#best-practices)
7. [Testing Plugins](#testing-plugins)
8. [Publishing](#publishing)

## Introduction

Nexi's plugin system allows developers to extend the platform's functionality with custom features, integrations, and AI capabilities.

### What Can Plugins Do?

- Add custom RAG data sources
- Integrate new AI models via MCP
- Create custom UI components
- Add voice processing features
- Extend translation capabilities
- Add automation workflows

## Plugin Architecture

### Plugin Structure

```bash
my-plugin/
├── plugin.json           # Plugin manifest
├── src/
│   ├── index.ts         # Plugin entry point
│   ├── actions/         # Plugin actions
│   ├── components/      # React components (optional)
│   └── services/        # Services (optional)
├── tests/
│   └── index.test.ts
├── package.json
└── README.md
```

### Plugin Manifest (plugin.json)

```json
{
  "id": "my-awesome-plugin",
  "name": "My Awesome Plugin",
  "version": "1.0.0",
  "description": "Adds awesome functionality to Nexi",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://yourwebsite.com"
  },
  "isPremium": false,
  "price": 0,
  "category": "rag",
  "keywords": ["rag", "data", "integration"],
  "homepage": "https://github.com/yourusername/my-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-plugin"
  },
  "license": "MIT",
  "main": "dist/index.js",
  "nexi": {
    "minVersion": "0.1.0",
    "maxVersion": "1.0.0"
  },
  "permissions": ["rag:read", "rag:write", "network:external"],
  "settings": [
    {
      "key": "apiKey",
      "label": "API Key",
      "type": "string",
      "required": true,
      "secret": true
    }
  ]
}
```

## Getting Started

### 1. Create Plugin Project

```bash
# Using our CLI tool
pnpm dlx create-nexi-plugin my-awesome-plugin

cd my-awesome-plugin
pnpm install
```

### 2. Plugin Entry Point (src/index.ts)

```typescript
import { Plugin, PluginContext } from "@nexi/plugin-api";

export default class MyAwesomePlugin implements Plugin {
  private context!: PluginContext;
  private initialized = false;

  /**
   * Plugin initialization
   * Called when plugin is loaded
   */
  async init(context: PluginContext): Promise<void> {
    this.context = context;

    // Initialize your plugin
    this.context.logger.info("Plugin initialized");

    this.initialized = true;
  }

  /**
   * Plugin activation
   * Called when user enables the plugin
   */
  async activate(): Promise<void> {
    if (!this.initialized) {
      throw new Error("Plugin not initialized");
    }

    this.context.logger.info("Plugin activated");

    // Register your actions, commands, etc.
    this.registerActions();
  }

  /**
   * Plugin deactivation
   * Called when user disables the plugin
   */
  async deactivate(): Promise<void> {
    this.context.logger.info("Plugin deactivated");

    // Cleanup
  }

  /**
   * Get plugin actions
   */
  getActions() {
    return [
      {
        id: "my-action",
        label: "My Action",
        icon: "star",
        execute: async () => {
          this.context.ui.showToast("Action executed!");
        },
      },
    ];
  }

  /**
   * Get plugin settings schema
   */
  getSettings() {
    return [
      {
        key: "apiKey",
        label: "API Key",
        type: "string",
        required: true,
        secret: true,
      },
    ];
  }

  private registerActions() {
    // Register actions with Nexi
  }
}
```

### 3. Build Plugin

```bash
pnpm build
```

### 4. Test Locally

```bash
# Link plugin for local testing
pnpm link

# In Nexi project
pnpm link my-awesome-plugin
```

## Plugin API Reference

### PluginContext

The context object provides access to Nexi's APIs:

```typescript
interface PluginContext {
  // Plugin metadata
  plugin: {
    id: string;
    name: string;
    version: string;
  };

  // Logging
  logger: {
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
  };

  // UI interactions
  ui: {
    showToast(message: string, type?: "success" | "error" | "info"): void;
    showDialog(options: DialogOptions): Promise<boolean>;
    registerComponent(id: string, component: React.ComponentType): void;
  };

  // RAG access
  rag: {
    createKnowledgeBase(name: string, options?: any): Promise<string>;
    addDocument(kbId: string, document: Document): Promise<void>;
    query(kbId: string, question: string): Promise<QueryResult>;
  };

  // MCP access
  mcp: {
    registerModel(model: ModelDefinition): void;
    sendMessage(modelId: string, message: string): Promise<string>;
  };

  // Settings
  settings: {
    get<T>(key: string): T | undefined;
    set(key: string, value: any): Promise<void>;
  };

  // Storage (key-value)
  storage: {
    get<T>(key: string): Promise<T | undefined>;
    set(key: string, value: any): Promise<void>;
    delete(key: string): Promise<void>;
  };

  // HTTP client
  http: {
    get<T>(url: string, options?: RequestOptions): Promise<T>;
    post<T>(url: string, data: any, options?: RequestOptions): Promise<T>;
  };
}
```

## Plugin Types

### RAG Plugin

Extends RAG functionality with custom data sources:

```typescript
export default class CustomRAGPlugin implements Plugin {
  async activate() {
    // Register custom document processor
    this.context.rag.registerProcessor({
      name: "custom-processor",
      supportedTypes: [".custom"],
      process: async (file: File) => {
        // Extract text from custom format
        const text = await this.extractText(file);
        return { text, metadata: {} };
      },
    });
  }

  private async extractText(file: File): Promise<string> {
    // Custom extraction logic
    return "";
  }
}
```

### MCP Plugin

Add support for new AI models:

```typescript
export default class CustomModelPlugin implements Plugin {
  async activate() {
    this.context.mcp.registerModel({
      id: "my-custom-model",
      name: "My Custom Model",
      provider: "custom",
      capabilities: ["chat", "code"],
      contextWindow: 4096,

      sendMessage: async (messages, options) => {
        // Call your model API
        const response = await this.callModelAPI(messages);
        return response;
      },
    });
  }

  private async callModelAPI(messages: any[]): Promise<string> {
    // API integration
    return "";
  }
}
```

### UI Plugin

Add custom UI components:

```typescript
import { CustomPanel } from "./components/CustomPanel";

export default class UIPlugin implements Plugin {
  async activate() {
    // Register custom panel
    this.context.ui.registerComponent("custom-panel", CustomPanel);

    // Add menu item
    this.context.ui.addMenuItem({
      id: "show-custom-panel",
      label: "Show Custom Panel",
      action: () => {
        this.context.ui.showPanel("custom-panel");
      },
    });
  }
}
```

### Voice Plugin

Extend voice capabilities:

```typescript
export default class VoicePlugin implements Plugin {
  async activate() {
    // Register custom TTS voice
    this.context.voice.registerVoice({
      id: "custom-voice",
      name: "Custom Voice",
      language: "en",

      synthesize: async (text: string) => {
        // Generate audio
        const audioBlob = await this.generateSpeech(text);
        return audioBlob;
      },
    });
  }

  private async generateSpeech(text: string): Promise<Blob> {
    // TTS logic
    return new Blob();
  }
}
```

## Best Practices

### 1. Error Handling

```typescript
async activate() {
  try {
    await this.initialize();
  } catch (error) {
    this.context.logger.error('Activation failed', error);
    throw error;
  }
}
```

### 2. Resource Cleanup

```typescript
async deactivate() {
  // Clean up listeners
  this.listeners.forEach(listener => listener.remove());

  // Close connections
  await this.connection?.close();

  // Clear timers
  clearInterval(this.timer);
}
```

### 3. Async Operations

```typescript
// Use async/await for better error handling
async fetchData() {
  try {
    const data = await this.context.http.get('/api/data');
    return data;
  } catch (error) {
    this.context.logger.error('Fetch failed', error);
    return null;
  }
}
```

### 4. User Feedback

```typescript
async performLongOperation() {
  this.context.ui.showToast('Processing...', 'info');

  try {
    await this.longRunningTask();
    this.context.ui.showToast('Completed!', 'success');
  } catch (error) {
    this.context.ui.showToast('Failed: ' + error.message, 'error');
  }
}
```

### 5. Permissions

Always request minimal permissions:

```json
{
  "permissions": [
    "rag:read", // Only what you need
    "network:external" // Be specific
  ]
}
```

## Testing Plugins

### Unit Tests

```typescript
// tests/index.test.ts
import { describe, it, expect, vi } from "vitest";
import MyPlugin from "../src/index";

describe("MyPlugin", () => {
  const mockContext = {
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
    // ... other mocks
  };

  it("initializes correctly", async () => {
    const plugin = new MyPlugin();
    await plugin.init(mockContext);

    expect(mockContext.logger.info).toHaveBeenCalledWith("Plugin initialized");
  });

  it("activates successfully", async () => {
    const plugin = new MyPlugin();
    await plugin.init(mockContext);
    await plugin.activate();

    expect(mockContext.logger.info).toHaveBeenCalledWith("Plugin activated");
  });
});
```

### Integration Tests

Test with actual Nexi instance:

```typescript
import { createTestContext } from "@nexi/plugin-testing";

describe("MyPlugin Integration", () => {
  it("works with real RAG", async () => {
    const context = await createTestContext();
    const plugin = new MyPlugin();

    await plugin.init(context);
    await plugin.activate();

    const result = await plugin.performAction();
    expect(result).toBeDefined();
  });
});
```

## Publishing

### 1. Prepare for Publishing

```bash
# Run tests
pnpm test

# Build
pnpm build

# Verify package
pnpm pack
```

### 2. Publish to Nexi Plugin Registry

```bash
# Login
pnpm nexi login

# Publish
pnpm nexi publish
```

### 3. Plugin Review Process

1. Submit plugin for review
2. Automated security scan
3. Manual code review (for premium plugins)
4. Approval/rejection
5. Published to marketplace

### 4. Versioning

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

## Premium Plugins

To monetize your plugin:

```json
{
  "isPremium": true,
  "price": 9.99,
  "billing": {
    "type": "subscription",
    "interval": "month"
  }
}
```

Revenue share: 70% developer, 30% platform

## Support & Resources

- [Plugin API Documentation](https://docs.nexi.app/plugins/api)
- [Example Plugins](https://github.com/nexi-app/plugin-examples)
- [Developer Forum](https://forum.nexi.app/plugins)
- [Plugin Ideas](https://github.com/nexi-app/plugin-ideas)

---

Happy plugin development! 🚀
