# Contributing to Nexi

Thank you for your interest in contributing to Nexi! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Prioritize the community and project health

## Getting Started

1. **Fork the repository**

   ```bash
   git clone https://github.com/yourusername/Nexi.git
   cd Nexi
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

## Development Workflow

### 1. Branch Naming Convention

- `feature/` - New features (e.g., `feature/rag-integration`)
- `fix/` - Bug fixes (e.g., `fix/voice-call-disconnect`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `refactor/` - Code refactoring (e.g., `refactor/state-management`)
- `test/` - Test additions or fixes (e.g., `test/plugin-system`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Development Process

```bash
# Make your changes
# ...

# Run tests
pnpm test

# Run linter
pnpm lint

# Build to verify
pnpm build
```

## Coding Standards

### TypeScript

- **Always use TypeScript** - No plain JavaScript files
- **Strict mode enabled** - Follow TypeScript strict rules
- **Type everything** - Avoid `any`, use proper types or `unknown`
- **Use interfaces for objects** - Prefer interfaces over types for object shapes

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ Avoid
type User = {
  id: any;
  name: any;
};
```

### React Components

- **Functional components only** - Use hooks, not classes
- **TypeScript for props** - Always type component props
- **Named exports preferred** - Easier to refactor and search

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// ❌ Avoid
export default function Button(props: any) {
  return <button>{props.label}</button>;
}
```

### File Organization

- **One component per file** - Easier to maintain
- **Co-locate tests** - `Component.tsx` and `Component.test.tsx` together
- **Barrel exports** - Use `index.ts` for clean imports

```bash
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   └── index.ts
```

### Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types/Interfaces**: PascalCase (`UserData`, `ApiResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

## Testing Requirements

### Required for All Contributions

1. **Unit Tests** - All new functions and utilities
2. **Component Tests** - All new React components
3. **Integration Tests** - For feature workflows

### Testing Guidelines

```typescript
// Component test example
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click" onClick={handleClick} />);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

### Coverage Requirements

- Maintain minimum 80% code coverage
- 100% coverage for critical paths (auth, payments, data loss)
- Run `pnpm test:coverage` before submitting PR

## Documentation

### Required Documentation

1. **Code Comments**
   - Complex logic explanations
   - JSDoc for public APIs
   - TODO/FIXME with context

2. **Component Documentation**

   ````typescript
   /**
    * Button component with multiple variants
    *
    * @example
    * ```tsx
    * <Button label="Submit" onClick={handleSubmit} variant="primary" />
    * ```
    */
   ````

3. **API Documentation**
   - Update `/docs/api.md` for new endpoints
   - Include request/response examples
   - Document error cases

4. **Update Changelog**
   - Add entry to `CHANGELOG.md` under `[Unreleased]`
   - Follow [Keep a Changelog](https://keepachangelog.com/) format

### Documentation Structure

```markdown
## [Unreleased]

### Added

- New feature description

### Changed

- Modified behavior description

### Fixed

- Bug fix description

### Deprecated

- Feature to be removed

### Removed

- Deleted feature

### Security

- Security improvements
```

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Tests added for new features
- [ ] No console.log or debugging code

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

[Add screenshots for UI changes]

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass locally
- [ ] Dependent changes merged
```

### Review Process

1. **Automated Checks** - CI must pass
2. **Code Review** - At least one approval required
3. **Testing** - Reviewers verify functionality
4. **Documentation** - Docs reviewed for clarity
5. **Merge** - Squash and merge to main

## Commit Message Guidelines

### Format

```bash
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, missing semicolons)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(rag): add document ingestion pipeline

Implement PDF and text document parsing with vector embedding
generation for RAG knowledge base.

Closes #123
```

```bash
fix(voice): resolve WebRTC connection timeout

Increase connection timeout and add retry logic for unstable
network conditions.

Fixes #456
```

## Development Tips

### State Management (Zustand)

```typescript
// Create a store
import { create } from "zustand";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### API Calls (TanStack Query)

```typescript
import { useQuery } from "@tanstack/react-query";

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });
}
```

### Form Handling (React Hook Form)

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  // ...
}
```

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Join our community chat (link TBD)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Nexi! 🚀
