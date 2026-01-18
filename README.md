# Nexi

> Advanced AI Platform with RAG, MCP, and Plugin Ecosystem

Nexi is a cutting-edge AI platform that showcases the power of modern AI technologies including Retrieval-Augmented Generation (RAG), Model Context Protocol (MCP), and an extensible plugin system. Built with a stunning Leonardo AI-inspired interface.

## ✨ Features

- **🧠 RAG (Retrieval-Augmented Generation)** - Customizable knowledge base integration
- **🔌 MCP (Model Context Protocol)** - Extensible AI model integration
- **🎨 Plugin Ecosystem** - Premium and free plugins for extended functionality
- **🎤 Voice Calls** - Real-time voice interaction with AI
- **🗣️ Multi-language Support** - NLLB-powered translation
- **🔊 Advanced TTS** - Multiple voice models for text-to-speech
- **🎯 3D UI/UX** - Beautiful Three.js-powered interface
- **⚡ Real-time Communication** - WebRTC and Socket.io integration

## 🚀 Tech Stack

### Core

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **pnpm** - Fast package manager

### State & Data

- **Zustand** - Lightweight state management
- **TanStack Query** - Server state & caching
- **Zod** - Schema validation

### UI & Styling

- **TailwindCSS 4** - Utility-first CSS
- **shadcn/ui** - High-quality component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icons

### Animation

- **Framer Motion** - Advanced animations
- **Auto-animate** - Simple transitions
- **React Spring** - Physics-based animations

### 3D & Visual

- **Three.js** - 3D rendering
- **React Three Fiber** - React renderer for Three.js
- **@react-three/drei** - Three.js helpers

### Forms & Interaction

- **React Hook Form** - Performant forms
- **@dnd-kit** - Drag and drop

### Communication

- **Axios** - HTTP client
- **Socket.io** - Real-time bidirectional communication
- **WebRTC** - Voice/video calls

### Development

- **Vitest** - Unit testing
- **Testing Library** - Component testing
- **ESLint** - Code linting
- **TypeScript ESLint** - TS-specific linting

### Code Editing

- **Monaco Editor** - VS Code editor for customization

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd Nexi

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🛠️ Development

```bash
# Development server
pnpm dev

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

## 📁 Project Structure

```bash
Nexi/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── features/        # Feature-specific components
│   │   └── layout/          # Layout components
│   ├── pages/               # Route pages
│   ├── hooks/               # Custom React hooks
│   ├── store/               # Zustand stores
│   ├── services/            # API services, WebRTC, Socket.io
│   ├── lib/                 # Utilities
│   ├── types/               # TypeScript types
│   └── test/                # Test setup
├── public/                  # Static assets
├── docs/                    # Documentation
└── ...config files
```

## 🎨 UI Components

Nexi uses shadcn/ui components with the "new-york" style. Available components:

- Button, Card, Dialog, Dropdown Menu
- Input, Label, Select, Textarea
- Tabs, Avatar, Badge, Separator
- Switch, Slider, Sonner (Toast)

## 🔌 Adding Plugins

Documentation for creating and integrating plugins coming soon.

## 🧪 Testing

All features include comprehensive tests using Vitest and React Testing Library.

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage report
pnpm test:coverage
```

## 📚 Documentation

- [API Documentation](./docs/api.md)
- [Architecture Guide](./docs/architecture.md)
- [Plugin Development](./docs/plugins.md)
- [Contributing Guide](./docs/CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT © Owen

## 🙏 Acknowledgments

- Built with modern React ecosystem
- Powered by open-source community

---

**Note:** This project is under active development. See [CHANGELOG.md](./CHANGELOG.md) for updates.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

---

**Note:** This project is under active development. See [CHANGELOG.md](./CHANGELOG.md) for updates.
