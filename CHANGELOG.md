# Changelog

All notable changes to Nexi will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Conversation Persistence**:
  - All chat conversations automatically saved to localStorage (`nexi-chat-storage`)
  - Messages, conversation titles, and active state persist across browser sessions
  - Automatic rehydration on app load using Zustand persist middleware
- **Comprehensive State Persistence**:
  - Theme preferences (`nexi-theme`) - Dark/Light/System with OS detection
  - User settings (`nexi-settings`) - Preferences, notifications, privacy, API keys
  - RAG collections (`nexi-rag-storage`) - Document collections and knowledge base
  - MCP servers (`nexi-mcp-storage`) - Custom server configurations
  - Plugins (`nexi-plugins-storage`) - Installed plugins and preferences
- **UI/UX Polish**:
  - Custom MCP servers now editable (Edit button with dialog for non-premium servers)
  - Plugins and Settings pages made scrollable with hidden scrollbars
  - RAG and MCP pages have hidden scrollbars for cleaner visuals
  - Light mode theme completely overhauled with soft blue-gray color palette
  - Dark mode background properly fixed (html.dark body selector)
  - Search input dark mode background corrected
  - Light mode shadows reduced for navbar and chat input (shadow-lg vs shadow-2xl)
  - Welcome section and suggestion buttons perfectly centered on dashboard
  - System theme support with matchMedia listener for OS preference changes
- **Full Settings Implementation**:
  - All settings now functional with localStorage persistence
  - Preferences: Language, suggestions, analytics tracking
  - Notifications: Email, push, and system notifications toggles
  - Privacy: Data collection, crash reports, usage analytics controls
  - API Keys: OpenAI, Anthropic, Google AI input fields
  - Data Management: Clear history, export data, delete account buttons
  - Display: Font size selection (small/medium/large) with live preview
  - Save/Reset functionality for all settings
- **Project Infrastructure**:
  - Comprehensive README badges (CI, CodeQL, TypeScript, React, Vite, pnpm, tests, license)
  - GitHub Actions CI workflow with Node 20.x and 22.x matrix testing
  - GitHub CodeQL security scanning workflow (daily scans)
  - Architecture section in README documenting all persistence stores
  - 69 comprehensive tests (4 new store test files)
- **Test Coverage**:
  - uiStore tests (9 tests): Theme management and sidebar controls
  - ragStore tests (8 tests): Collection and document CRUD operations
  - mcpStore tests (8 tests): Server management and connections
  - pluginStore tests (8 tests): Plugin filtering and installation
  - chatStore persistence tests (3 tests): localStorage save/load/clear
  - Total: 69 tests passing, 2 skipped
- **Conversation History**: Sidebar now displays all conversations sorted by most recent
  - New Chat button to create new conversations
  - Automatically sets newly created conversation as active
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
  - `clearHistory()` method to clear all conversations

### Changed

- Settings page now loads and persists all user preferences
- Font size setting applies to entire application (14px/16px/18px)
- Theme system enhanced with system preference detection
- All stores now use Zustand persist middleware for automatic saving
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

- **ESLint Issues**:
  - DashboardPage: Added missing dependencies to useEffect (conversations.length, createConversation)
  - RAGPage: Removed unused 'documents' variable
  - SettingsPage: Fixed setState in effect warning by wrapping in loadSettings function
  - creditStore: Prefixed unused parameters with underscore (_userId,_amount)
  - uiStore: Removed unused event parameter from matchMedia listener
  - Pre-commit hook now passes with all ESLint errors resolved
- **Theme Issues**:
  - Light mode color palette (soft blue-gray tones instead of harsh black/white)
  - Dark mode CSS selectors (html.dark body instead of .dark body)
  - Input component dark mode background (bg-background dark:bg-input)
  - Shadow intensity in light mode (reduced from shadow-black/50 to shadow-black/20)
  - Navbar shadow too strong in light mode (shadow-lg instead of shadow-2xl)
  - Chat input shadow too strong in light mode
- **Layout Issues**:
  - Welcome text and suggestion buttons now properly centered with mx-auto
  - Scrollbar visibility in MCP, RAG, Plugins, and Settings pages
  - Custom MCP servers couldn't be edited (added Edit functionality)
- **Test Failures**:
  - window.matchMedia mock added to test setup
  - ProfilePage test updated for GitHub/Google accounts (removed Twitter/Telegram/Solana)
  - chatStore test updated for time-based conversation titles (Chat HH:MM format)
  - pluginStore test fixed for install-then-toggle behavior
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
