# Getting Started with Nexi

Welcome to Nexi! This guide will help you get up and running quickly.

## Prerequisites

- **Node.js** 20+
- **pnpm** 10.28.0+

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open browser to http://localhost:5173
```

## Development

### Available Commands

```bash
# Development
pnpm dev              # Start dev server with HMR

# Testing
pnpm test             # Run tests in watch mode
pnpm test --run       # Run tests once
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Generate coverage report

# Build
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Lint code
```

## Project Overview

### What's Included

✅ **Dark Theme** - Modern dark UI matching your design  
✅ **Responsive Layout** - Mobile-first, works on all devices  
✅ **Dashboard** - Welcome page with action cards  
✅ **Profile** - Credits, plan info, account linking  
✅ **Navigation** - Sidebar with collapsible view  
✅ **State Management** - Zustand stores configured  
✅ **Routing** - React Router with 7 routes  
✅ **Testing** - Vitest + Testing Library setup  
✅ **Documentation** - Complete docs in `/docs`

### Routes

- `/` - Dashboard
- `/profile` - User profile
- `/rag` - RAG features (placeholder)
- `/mcp` - MCP integration (placeholder)
- `/plugins` - Plugin marketplace (placeholder)
- `/voice` - Voice features (placeholder)
- `/settings` - Settings (placeholder)

## Next Steps

### 1. Explore the Dashboard

Visit `http://localhost:5173` to see:

- Welcome message with animated cards
- 3 action cards (3D, Comic, Video creation)
- Quick stats

### 2. Check Your Profile

Click "Profile" in sidebar to see:

- Credits used (0/10)
- Plan information
- Account linking options (Twitter, Telegram, Solana)

### 3. Test Responsiveness

- Resize browser window
- Open on mobile device
- Check sidebar collapse on desktop

## Customization

### Theme Colors

Edit `src/index.css` to adjust colors:

```css
.dark {
    --background: oklch(0.12 0 0); /* Main background */
    --primary: oklch(0.65 0.15 250); /* Accent color */
    --card: oklch(0.18 0 0); /* Card background */
    /* ... */
}
```

### Add New Pages

1. Create page in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation item in `src/components/layout/Sidebar.tsx`
4. Write tests in `src/pages/YourPage.test.tsx`

### State Management

```typescript
// Create a new store
import { create } from 'zustand';

interface MyStore {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyStore>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// Use in component
import { useMyStore } from '@/store/myStore';

function MyComponent() {
  const { count, increment } = useMyStore();
  return <button onClick={increment}>{count}</button>;
}
```

## Features to Implement

Based on your requirements, here's the roadmap:

### Phase 1: RAG System ✨

- [ ] Document upload UI
- [ ] Knowledge base management
- [ ] Vector database integration
- [ ] Query interface

### Phase 2: MCP Integration ✨

- [ ] Model selection UI
- [ ] Context management
- [ ] Model switching
- [ ] Settings configuration

### Phase 3: Plugin System ✨

- [ ] Plugin marketplace
- [ ] Installation flow
- [ ] Premium plugin checkout
- [ ] Plugin configuration UI

### Phase 4: Voice Features ✨

- [ ] Whisper integration for STT
- [ ] TTS engine setup
- [ ] Voice call UI
- [ ] WebRTC implementation

### Phase 5: Translation ✨

- [ ] NLLB integration
- [ ] Language selector
- [ ] Real-time translation
- [ ] Multi-language UI

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
pnpm dev -- --port 3000
```

### Tests Failing

```bash
# Clear cache
rm -rf node_modules/.vite
pnpm install

# Run tests with verbose output
pnpm test -- --reporter=verbose
```

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
pnpm install
pnpm build
```

## Resources

- 📖 [Full Documentation](./docs/)
- 🏗️ [Architecture Guide](./docs/architecture.md)
- 🔌 [Plugin Development](./docs/plugins.md)
- 🧪 [Testing Guide](./docs/testing.md)
- 🤝 [Contributing](./docs/CONTRIBUTING.md)

## Need Help?

1. Check the [docs](./docs/)
2. Review [CHANGELOG.md](./CHANGELOG.md)
3. Look at component tests for examples
4. Open an issue on GitHub

---

**Ready to build something amazing!** 🚀

Start with `pnpm dev` and open <http://localhost:5173>
