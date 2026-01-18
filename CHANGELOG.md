# Changelog

All notable changes to Nexi will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Conversation History**: Sidebar now displays all conversations sorted by most recent
  - New Chat button to create new conversations - Automatically sets newly created conversation as active
  - Click conversations to switch between them
  - Delete individual conversations with trash icon (appears on hover)
  - Conversations section with visual hierarchy
- **Desktop Sidebar Controls**:
  - Collapse/expand button (PanelLeftClose icon) with smooth width animation
  - Desktop: collapses to icon-only view
  - Mobile: slides out completely
  - Click collapsed "N" logo to expand
- Chat store enhancements:
  - `deleteConversation()` method to remove conversations
  - `updateConversationTitle()` method to rename conversations
- Comprehensive test coverage:
  - 11 new Sidebar tests (conversation history, new chat, delete, collapse)
  - 2 new chatStore tests (update title functionality)
  - Total: 33 tests passing (2 skipped due to test environment constraints)

### Changed

- Sidebar navigation: Removed "Chat" from main nav (conversations replace it)
- Sidebar layout restructured with dedicated sections:
  - Header with logo and close button
  - New Chat button section
  - Scrollable conversation history
  - Bottom navigation (RAG, MCP, Plugins, Settings)
  - User profile at bottom
- Navbar icons increased to h-7/w-7 (Menu, Bell) for better visibility
- Background optimized for mobile vs desktop:
  - Mobile: Solid dark (#05070d) to avoid gradient artifacts
  - Desktop (1024px+): Cinematic multi-layer gradient with blue glow and vignette

### Fixed

- **UI State Glitches**:
  - New Chat button now properly sets active conversation ID
  - Prevents duplicate conversation creation on page mount (only creates if none exist)
  - Conversation list properly re-renders when state changes
- Sidebar controls:
  - Desktop collapse button uses appropriate icon (PanelLeftClose) instead of X
  - Proper behavior distinction between desktop (collapse) and mobile (close)
  - Collapsed state shows clickable "N" logo to expand
- Navbar icon sizing (was constrained by button variant styles)
- Background gradient visibility (removed conflicting bg-background class)
- Gradient positioning (centered at 52% horizontal, 35% vertical)
- Icon color scheme adjusted to proper blue tone (#5A82FF)

### Changed (Previous Updates)

- **Major Update**: Replaced dashboard page with AI chat interface
  - Removed action cards and stats section
  - Implemented real-time chat interface with message history
  - Added welcome state with suggestion prompts ("Explain quantum computing", etc.)
  - Messages display with user/assistant avatars and animations
  - Added typing indicator and loading states
  - Enter to send (Shift+Enter for new line)

### Added

- Chat store (`chatStore.ts`) for managing conversations and messages
- Chat types (`types/chat.ts`) for Message and Conversation interfaces
- Textarea component for multi-line message input
- Comprehensive tests for chat interface and store (14 new tests, 23 total passing)
- Auto-scroll to latest message functionality
- Mock AI responses (ready for real API integration)

### Fixed

- Mobile sidebar now starts closed by default
- Sidebar auto-closes when navigating on mobile
- Added backdrop overlay for mobile sidebar
- Desktop sidebar auto-opens on load

### Added (Initial Setup)

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
- **Dark theme implementation** matching UI design:
  - Deep dark background (oklch 0.12)
  - Card elevation with subtle borders
  - Blue-ish primary accent color
  - Custom scrollbar styling
  - Responsive color tokens
- **Layout components**:
  - Responsive Sidebar with collapse functionality
  - Header with search, notifications, and credits display
  - MainLayout wrapper with proper spacing
  - Mobile-first responsive design
- **Core pages**:
  - Dashboard with welcome message and action cards
  - Profile page with credits, plan info, and account linking
  - Quick stats cards
- **State management**:
  - User store for authentication and profile data
  - UI store for theme and sidebar state
- **Routing**:
  - React Router setup with 7 routes
  - Protected route structure
  - 404 handling
- **Tests**:
  - Store tests (userStore)
  - Component tests (Dashboard, Profile pages)
  - Test coverage setup

### Infrastructure

- pnpm as package manager
- Path aliases configured (`@/` -> `./src/`)
- Vitest configuration with jsdom environment
- Test setup with jest-dom matchers
- Build scripts for development and production
- Dark mode as default theme

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
