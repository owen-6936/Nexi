# Testing Guide

> Comprehensive testing documentation for Nexi

## Table of Contents

1. [Overview](#overview)
2. [Testing Stack](#testing-stack)
3. [Running Tests](#running-tests)
4. [Unit Testing](#unit-testing)
5. [Component Testing](#component-testing)
6. [Integration Testing](#integration-testing)
7. [Test Coverage](#test-coverage)
8. [Best Practices](#best-practices)
9. [CI/CD](#cicd)

## Overview

Nexi uses a comprehensive testing strategy to ensure code quality and reliability:

- **Unit Tests**: Individual functions and utilities
- **Component Tests**: React components
- **Integration Tests**: Feature workflows
- **E2E Tests**: (Future) Full user journeys

## Testing Stack

- **Vitest**: Fast unit testing framework
- **Testing Library**: React component testing
- **jest-dom**: DOM matchers
- **user-event**: User interaction simulation
- **MSW**: API mocking (planned)

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (recommended during development)
pnpm test --watch

# Run specific test file
pnpm test src/components/Button.test.tsx

# Run tests matching pattern
pnpm test --grep "Button"

# UI mode (interactive)
pnpm test:ui

# Coverage report
pnpm test:coverage

# Coverage with UI
pnpm test:coverage --ui
```

## Unit Testing

### Testing Utilities

```typescript
// lib/formatters.ts
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

// lib/formatters.test.ts
import { describe, it, expect } from "vitest";
import { formatCurrency } from "./formatters";

describe("formatCurrency", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(100)).toBe("$100.00");
  });

  it("formats EUR correctly", () => {
    expect(formatCurrency(100, "EUR")).toBe("€100.00");
  });

  it("handles decimals", () => {
    expect(formatCurrency(99.99)).toBe("$99.99");
  });

  it("handles negative numbers", () => {
    expect(formatCurrency(-50)).toBe("-$50.00");
  });
});
```

### Testing Hooks

```typescript
// hooks/useCounter.ts
import { useState } from "react";

export function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

// hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("initializes with default value", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("initializes with custom value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments count", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("decrements count", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it("resets to initial value", () => {
    const { result } = renderHook(() => useCounter(10));

    act(() => {
      result.current.increment();
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.count).toBe(10);
  });
});
```

### Testing Stores (Zustand)

```typescript
// store/userStore.ts
import { create } from "zustand";

interface User {
  id: string;
  name: string;
}

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// store/userStore.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "./userStore";

describe("userStore", () => {
  beforeEach(() => {
    // Reset store before each test
    useUserStore.setState({ user: null });
  });

  it("initializes with null user", () => {
    const { user } = useUserStore.getState();
    expect(user).toBeNull();
  });

  it("sets user", () => {
    const testUser = { id: "1", name: "John" };

    useUserStore.getState().setUser(testUser);

    const { user } = useUserStore.getState();
    expect(user).toEqual(testUser);
  });

  it("clears user", () => {
    useUserStore.setState({ user: { id: "1", name: "John" } });

    useUserStore.getState().clearUser();

    const { user } = useUserStore.getState();
    expect(user).toBeNull();
  });
});
```

## Component Testing

### Basic Component Test

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export function Button({
  label,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}

// components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);

    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button label="Click" onClick={handleClick} />);

    await user.click(screen.getByText('Click'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button label="Click" onClick={handleClick} disabled />);

    await user.click(screen.getByText('Click'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies variant class', () => {
    render(<Button label="Test" onClick={() => {}} variant="secondary" />);

    const button = screen.getByText('Test');
    expect(button).toHaveClass('btn-secondary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Test" onClick={() => {}} disabled />);

    expect(screen.getByText('Test')).toBeDisabled();
  });
});
```

### Testing with Props and State

```typescript
// components/features/Counter.tsx
import { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  step?: number;
}

export function Counter({ initialValue = 0, step = 1 }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + step)}>Increment</button>
      <button onClick={() => setCount(count - step)}>Decrement</button>
      <button onClick={() => setCount(initialValue)}>Reset</button>
    </div>
  );
}

// components/features/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Counter } from './Counter';

describe('Counter', () => {
  it('displays initial count', () => {
    render(<Counter initialValue={5} />);

    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  it('increments count', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByText('Increment'));

    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('decrements count', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={5} />);

    await user.click(screen.getByText('Decrement'));

    expect(screen.getByText('Count: 4')).toBeInTheDocument();
  });

  it('increments by step', async () => {
    const user = userEvent.setup();
    render(<Counter step={5} />);

    await user.click(screen.getByText('Increment'));

    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  it('resets to initial value', async () => {
    const user = userEvent.setup();
    render(<Counter initialValue={10} />);

    await user.click(screen.getByText('Increment'));
    await user.click(screen.getByText('Increment'));
    await user.click(screen.getByText('Reset'));

    expect(screen.getByText('Count: 10')).toBeInTheDocument();
  });
});
```

### Testing with Context/Providers

```typescript
// Test helper
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Usage
it('renders with theme', () => {
  renderWithProviders(<MyComponent />);
  // assertions...
});
```

## Integration Testing

### Testing Feature Workflows

```typescript
// RAG document upload workflow test
describe('RAG Document Upload', () => {
  it('completes full upload workflow', async () => {
    const user = userEvent.setup();

    render(<DocumentUpload />);

    // Select file
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByLabelText('Upload document');
    await user.upload(input, file);

    // Verify file selected
    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    // Upload
    await user.click(screen.getByText('Upload'));

    // Verify loading state
    expect(screen.getByText('Uploading...')).toBeInTheDocument();

    // Wait for success
    await waitFor(() => {
      expect(screen.getByText('Upload successful')).toBeInTheDocument();
    });
  });
});
```

## Test Coverage

### Coverage Goals

- **Overall**: 80% minimum
- **Critical paths**: 100%
- **Utilities**: 90%+
- **Components**: 80%+

### Viewing Coverage

```bash
pnpm test:coverage
```

Opens an HTML report showing:

- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

### Coverage Reports

```bash
File                 | % Stmts | % Branch | % Funcs | % Lines
---------------------|---------|----------|---------|--------
All files            |   85.42 |    78.26 |   82.14 |   85.67
 components/ui       |   91.23 |    85.71 |   88.89 |   91.23
  Button.tsx         |   100   |    100   |   100   |   100
  Input.tsx          |   95.45 |    87.50 |   100   |   95.45
 lib                 |   88.89 |    75.00 |   85.71 |   88.89
  utils.ts           |   88.89 |    75.00 |   85.71 |   88.89
```

## Best Practices

### 1. AAA Pattern

```typescript
it("increments counter", () => {
  // Arrange
  const { result } = renderHook(() => useCounter());

  // Act
  act(() => result.current.increment());

  // Assert
  expect(result.current.count).toBe(1);
});
```

### 2. Test User Behavior, Not Implementation

```typescript
// ❌ Bad - tests implementation
it('calls setState with correct value', () => {
  const setState = vi.fn();
  // ...
  expect(setState).toHaveBeenCalledWith(5);
});

// ✅ Good - tests user-visible behavior
it('displays updated count after increment', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByText('Increment'));

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 3. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { ... });

// ✅ Good
it('displays error message when API call fails', () => { ... });
```

### 4. One Assertion Per Test (When Possible)

```typescript
// ❌ Bad - testing multiple things
it("button works", () => {
  expect(button).toBeInTheDocument();
  expect(button).toHaveClass("primary");
  expect(button).not.toBeDisabled();
});

// ✅ Good - separate concerns
it("renders button", () => {
  expect(button).toBeInTheDocument();
});

it("applies primary class", () => {
  expect(button).toHaveClass("primary");
});

it("is enabled by default", () => {
  expect(button).not.toBeDisabled();
});
```

### 5. Clean Up After Tests

```typescript
beforeEach(() => {
  // Setup
  vi.clearAllMocks();
  useUserStore.setState({ user: null });
});

afterEach(() => {
  // Cleanup
  cleanup();
});
```

### 6. Mock External Dependencies

```typescript
// Mock API calls
vi.mock("@/services/api", () => ({
  fetchUser: vi.fn(() => Promise.resolve({ id: "1", name: "Test" })),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router", () => ({
  useNavigate: () => mockNavigate,
}));
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 10

      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "pnpm"

      - run: pnpm install

      - run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "pnpm test --run",
      "pre-push": "pnpm test:coverage"
    }
  }
}
```

---

For more testing resources:

- [Vitest Documentation](https://vitest.dev)
- [Testing Library](https://testing-library.com/react)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
