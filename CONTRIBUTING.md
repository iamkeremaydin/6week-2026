# Contributing to 6+1 Week Cycle Calendar

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/iamkeremaydin/6week-2026.git
   cd 6week-2026
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Locally

```bash
npm run dev              # Start development server
npm run lint             # ESLint + React Compiler checks
npm run test             # Unit tests (Vitest)
npm run test:e2e         # E2E tests (Playwright)
npm run knip             # Detect unused code
npm run analyze          # Bundle size analysis
```

### Making Changes

1. **Write your code** following the project's conventions
2. **Add tests** for new features or bug fixes
3. **Update documentation** if needed
4. **Run tests and linting** before committing
5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug in component"
   git commit -m "docs: update README"
   ```

### Commit Message Convention

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Project Structure

```
6week/
├── app/                # Next.js app directory
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Demo page
│   └── globals.css    # Global styles
├── components/
│   ├── calendar/      # Calendar-specific components
│   │   ├── CalendarView.tsx
│   │   ├── YearTimeline.tsx
│   │   ├── MonthGrid.tsx
│   │   ├── AgendaList.tsx
│   │   └── Legend.tsx
│   └── icons/         # Reusable icon components
│       ├── SunIcon.tsx
│       ├── MoonIcon.tsx
│       └── index.ts
├── hooks/             # Custom React hooks
│   └── useCycleLogic.ts
├── lib/               # Core logic and utilities
│   └── calendar/      # Calendar calculation functions
│       ├── cycle-logic.ts
│       ├── types.ts
│       └── constants.ts  # Configuration constants
└── ...
```

## Code Guidelines

### TypeScript

- Use TypeScript for all new files
- Define explicit types for props and return values
- Use interfaces for object types
- Avoid `any` - use `unknown` if type is truly unknown

```typescript
// Good
interface Props {
  year: number;
  onSelect: (date: Date) => void;
}

// Avoid
const props: any = { ... };
```

### JSDoc Documentation

- Add JSDoc comments to all exported functions
- Include parameter descriptions and return types
- Add example usage where helpful
- See `lib/calendar/cycle-logic.ts` for reference

```typescript
// Good
/**
 * Builds an array of work/rest blocks for a given year.
 * 
 * @param config - Configuration object containing cycle parameters
 * @param year - The calendar year to generate blocks for
 * @returns Array of Block objects covering the specified year
 * @example
 * ```ts
 * const blocks = buildSixPlusOneBlocks({
 *   cycleStartDate: new Date(2026, 0, 1),
 *   workWeeks: 6,
 *   restWeeks: 1
 * }, 2026);
 * ```
 */
export function buildSixPlusOneBlocks(config: CycleConfig, year: number): Block[] {
  // implementation
}

// Avoid - no documentation
export function buildSixPlusOneBlocks(config: CycleConfig, year: number): Block[] {
  // implementation
}
```

### Constants Usage

- Use constants from `lib/calendar/constants.ts` instead of magic numbers
- Import only what you need for better tree-shaking
- Add new constants to the file rather than hardcoding values

```typescript
// Good
import { ANIMATION_CONFIG, DIMENSIONS } from "@/lib/calendar/constants";

transition={{ 
  duration: ANIMATION_CONFIG.DURATION_NORMAL,
  delay: ANIMATION_CONFIG.DELAY_STAGGER 
}}

// Avoid - magic numbers
transition={{ 
  duration: 0.3,
  delay: 0.01 
}}
```

```typescript
// Good
import { CYCLE_CONFIG } from "@/lib/calendar/constants";

const totalWeeks = CYCLE_CONFIG.TOTAL_WEEKS_IN_CYCLE;

// Avoid - hardcoded values
const totalWeeks = 7;
```

### React Components

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into hooks
- Use `"use client"` directive when needed

```tsx
"use client";

import { useState } from "react";

export function MyComponent({ initialValue }: { initialValue: number }) {
  const [value, setValue] = useState(initialValue);
  // ...
}
```

### Styling

- Use Tailwind CSS v4 utility classes
- Follow the existing color scheme (work/rest colors)
- Ensure dark mode support with `dark:` classes
- Keep responsive design in mind
- Customize colors in `app/globals.css` using the `@theme` block

```tsx
<div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg">
  {/* ... */}
</div>
```

**Tailwind v4 Custom Colors:**

```css
/* In app/globals.css */
@theme {
  --color-work-500: #0ea5e9;
  --color-rest-500: #d946ef;
}
```

### Animations

- Use Motion (Framer Motion) with LazyMotion for optimized bundle size
- Use `m` instead of `motion` for all animated elements
- Keep animations subtle and purposeful
- Ensure 60fps performance
- Use animation constants from `lib/calendar/constants.ts`

```tsx
import { m } from 'motion/react';
import { ANIMATION_CONFIG } from '@/lib/calendar/constants';

<m.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: ANIMATION_CONFIG.DURATION_NORMAL }}
>
  {/* ... */}
</m.div>
```

**Note:** `LazyMotion` is already configured in `app/layout.tsx` - all motion components will be automatically optimized.

## Testing

### Writing Unit Tests

- Write tests for all core logic functions
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused and readable

```typescript
import { describe, it, expect } from 'vitest';
import { buildSixPlusOneBlocks } from './cycle-logic';

describe("buildSixPlusOneBlocks", () => {
  it("should generate correct number of blocks for a year", () => {
    const blocks = buildSixPlusOneBlocks(config, 2026);
    expect(blocks.length).toBeGreaterThan(0);
  });
});
```

### Writing E2E Tests

Create tests in the `e2e/` directory:

```typescript
import { test, expect } from '@playwright/test';

test('calendar loads correctly', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/6\+1 Week Cycle/i)).toBeVisible();
});
```

### Running Tests

```bash
# Unit tests
npm test                  # Run Vitest
npm run test:ui          # Interactive UI
npm run test:coverage    # Coverage report

# E2E tests
npm run test:e2e         # Run Playwright
npm run test:e2e:ui      # Playwright UI mode

# Code quality
npm run knip             # Find unused code
npm run lint             # ESLint + React Compiler
```

## Performance & Optimization

### React Compiler

The React 19 Compiler is enabled - it automatically optimizes components:

**DON'T manually memoize:**

```tsx
// ❌ No longer needed
const value = useMemo(() => compute(data), [data]);
const handler = useCallback(() => onClick(), []);
```

**DO write clean code:**

```tsx
// ✅ Compiler handles optimization
const value = compute(data);
const handler = () => onClick();
```

**ESLint will warn** if you write code that prevents compiler optimization.

### Logging Best Practices

Use structured logging instead of console.log:

```tsx
import { createLogger } from '@/lib/logger';

const log = createLogger('MyComponent');

// ✅ Good
log.info({ userId, action }, 'User action completed');
log.error({ error, context }, 'Operation failed');

// ❌ Avoid
console.log('User action completed');
```

### Constants Usage

Always use constants instead of magic numbers:

```tsx
import { ANIMATION_CONFIG, CYCLE_CONFIG } from '@/lib/calendar/constants';

// ✅ Good
const duration = ANIMATION_CONFIG.DURATION_NORMAL;
const weeks = CYCLE_CONFIG.DEFAULT_WORK_WEEKS;

// ❌ Avoid
const duration = 0.3;
const weeks = 6;
```

### Dead Code Detection

Run Knip before submitting:

```bash
npm run knip
```

Remove any unused exports, dependencies, or files it identifies.

## Pull Request Process

1. **Update documentation** if you've made user-facing changes
2. **Ensure all tests pass** and linting succeeds
3. **Update CHANGELOG** if applicable
4. **Submit PR** with a clear description:
   - What changes were made
   - Why they were necessary
   - Any breaking changes
   - Screenshots (for UI changes)

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test your changes?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## Areas for Contribution

### High Priority

- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Performance optimizations
- [ ] Test coverage improvements
- [ ] Documentation enhancements

### Feature Ideas

- [ ] Export calendar to ICS format
- [ ] Print-friendly view
- [ ] Customizable color themes
- [ ] Weekly/daily view modes
- [ ] Multi-user sync (with backend)
- [ ] Mobile app version
- [ ] Calendar sharing/embedding

### Bug Fixes

Check the [Issues](https://github.com/iamkeremaydin/6week-2026/issues) page for reported bugs.

## Questions?

- Open an issue for discussion
- Check existing issues and PRs first
- Be specific about your question or proposal

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the 6+1 Week Cycle Calendar! 🎉

