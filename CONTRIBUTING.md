# Contributing to 6+1 Week Cycle Calendar

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/6week-calendar.git
   cd 6week-calendar
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
npm run dev          # Start development server
npm run lint         # Check for linting errors
npm run test         # Run tests
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
├── components/        # React components
│   └── calendar/      # Calendar-specific components
├── hooks/             # Custom React hooks
├── lib/               # Core logic and utilities
│   └── calendar/      # Calendar calculation functions
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

- Use Tailwind CSS utility classes
- Follow the existing color scheme (work/rest colors)
- Ensure dark mode support with `dark:` classes
- Keep responsive design in mind

```tsx
<div className="bg-white dark:bg-gray-900 p-4 md:p-6 rounded-lg">
  {/* ... */}
</div>
```

### Animations

- Use Motion (Framer Motion) for animations
- Keep animations subtle and purposeful
- Ensure 60fps performance
- Use spring physics for natural motion

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  {/* ... */}
</motion.div>
```

## Testing

### Writing Tests

- Write tests for all core logic functions
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused and readable

```typescript
describe("buildSixPlusOneBlocks", () => {
  it("should generate correct number of blocks for a year", () => {
    const blocks = buildSixPlusOneBlocks(config, 2026);
    expect(blocks.length).toBeGreaterThan(0);
  });
});
```

### Running Tests

```bash
npm test              # Run all tests
npm run test:ui       # Run with UI
npm run test:coverage # Check coverage
```

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

Check the [Issues](https://github.com/yourusername/6week-calendar/issues) page for reported bugs.

## Questions?

- Open an issue for discussion
- Check existing issues and PRs first
- Be specific about your question or proposal

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the 6+1 Week Cycle Calendar! 🎉

