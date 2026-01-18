# Changelog

All notable changes to Nexi will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with Vite + React + TypeScript
- Core tech stack configuration:
  - Zustand for state management
  - TanStack Query for server state
  - shadcn/ui component library (new-york style)
  - TailwindCSS 4 for styling
  - Framer Motion, Auto-animate, React Spring for animations
  - Three.js + React Three Fiber for 3D UI
- Development tooling:
  - Vitest for unit testing
  - React Testing Library for component testing
  - ESLint with TypeScript support
- Project structure:
  - `/src/components` - UI and feature components
  - `/src/pages` - Route pages
  - `/src/hooks` - Custom React hooks
  - `/src/store` - Zustand stores
  - `/src/services` - API and external services
  - `/src/lib` - Utility functions
  - `/src/types` - TypeScript type definitions
  - `/src/test` - Test configuration
- Documentation:
  - README.md with comprehensive project overview
  - CHANGELOG.md for tracking changes
  - Docs structure in `/docs` folder
- shadcn/ui components:
  - Button, Card, Dialog, Dropdown Menu
  - Input, Label, Select, Textarea, Tabs
  - Avatar, Badge, Separator, Switch, Slider
  - Sonner (Toast notifications)

### Infrastructure

- pnpm as package manager
- Path aliases configured (`@/` -> `./src/`)
- Vitest configuration with jsdom environment
- Test setup with jest-dom matchers
- Build scripts for development and production

## [0.0.0] - 2026-01-18

### Initial Setup

- Repository created
- Project scaffolded with Vite
- Dependencies installed
- Configuration files set up

---

## Version Planning

### [0.1.0] - RAG Foundation (Planned)

- RAG system architecture
- Knowledge base integration
- Document ingestion pipeline
- Vector database integration

### [0.2.0] - MCP Integration (Planned)

- Model Context Protocol implementation
- Multi-model support
- Context management system
- Model switching interface

### [0.3.0] - Plugin System (Planned)

- Plugin architecture
- Plugin API
- Plugin marketplace UI
- Premium plugin management

### [0.4.0] - Voice Features (Planned)

- Whisper integration for speech-to-text
- TTS engine integration
- WebRTC voice calls
- Real-time audio processing

### [0.5.0] - Translation & Multilingual (Planned)

- NLLB translation integration
- Multi-language UI support
- Real-time translation in conversations

### [1.0.0] - Production Release (Planned)

- All core features stable
- Comprehensive documentation
- Production-ready deployment
- Performance optimizations

---

## Contributing

See [docs/CONTRIBUTING.md](./docs/CONTRIBUTING.md) for how to contribute to this changelog.
