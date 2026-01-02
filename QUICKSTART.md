# Quick Start Guide

Get up and running with the 6+1 Week Cycle Calendar in under 5 minutes.

## Installation

```bash
# Clone the repository
git clone https://github.com/iamkeremaydin/6week-2026.git
cd 6week-2026

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal)

## Basic Usage

### 1. Import and Use

```tsx
import { CalendarView } from "@/components/calendar/CalendarView";

export default function Page() {
  return <CalendarView year={2026} />;
}
```

That's it! You now have a fully functional calendar.

### 2. Customize Configuration

```tsx
<CalendarView
  year={2026}
  cycleStartDate={new Date(2026, 2, 15)}  // Start mid-March
  workWeeks={4}                            // 4 work weeks
  restWeeks={2}                            // 2 rest weeks
  weekStartsOn={0}                         // Sunday
/>
```

### 3. Build Your Own UI

```tsx
import { useCycleLogic } from "@/hooks/useCycleLogic";

function MyCalendar() {
  const { blocks, currentBlock, totalCycles } = useCycleLogic({
    year: 2026,
    cycleStartDate: new Date(2026, 0, 1),
  });

  return (
    <div>
      <h1>Total Cycles: {totalCycles}</h1>
      <p>Current: Cycle {currentBlock?.cycleNumber}</p>
      {/* Your custom UI */}
    </div>
  );
}
```

## Key Features

- 📅 **Three Views**: Timeline, Month Grid, Agenda
- 🎨 **Animated**: Smooth, premium animations
- 🌓 **Dark Mode**: Toggle in top-right corner
- 🔍 **Filterable**: By type (work/rest) or cycle number
- 📱 **Responsive**: Works on all devices

## Testing

```bash
# Unit tests
npm test              # Run Vitest
npm run test:ui       # Open test UI
npm run test:coverage # Run with coverage

# E2E tests
npm run test:e2e      # Run Playwright tests
npm run test:e2e:ui   # Run with Playwright UI

# Code quality
npm run lint          # ESLint + React Compiler checks
npm run knip          # Find unused code/dependencies
```

## Common Patterns

### Pattern 1: Show Only Rest Weeks

```tsx
const { setFilterOptions } = useCycleLogic({ year: 2026 });
setFilterOptions({ blockType: "rest" });
```

### Pattern 2: Check if Today is a Work Week

```tsx
const { isWorkWeek } = useCycleLogic({ year: 2026 });
const today = new Date();
if (isWorkWeek(today)) {
  console.log("Time to work!");
}
```

### Pattern 3: Generate ICS Export

```tsx
import { buildSixPlusOneBlocks } from "@/lib/calendar/cycle-logic";

const blocks = buildSixPlusOneBlocks(
  { cycleStartDate: new Date(2026, 0, 1), workWeeks: 6, restWeeks: 1, weekStartsOn: 1 },
  2026
);
// Process blocks for export
```

## Customization

### Change Colors

Edit `app/globals.css` (Tailwind v4 uses CSS-based configuration):

```css
@theme {
  /* Customize work cycle colors */
  --color-work-500: #0ea5e9;
  --color-work-600: #0284c7;
  
  /* Customize rest cycle colors */
  --color-rest-500: #d946ef;
  --color-rest-600: #c026d3;
}
```

### Adjust Animations

Use constants from `lib/calendar/constants.ts`:

```tsx
import { ANIMATION_CONFIG } from "@/lib/calendar/constants";

// In your component
transition={{ 
  duration: ANIMATION_CONFIG.DURATION_NORMAL, 
  delay: ANIMATION_CONFIG.DELAY_STAGGER 
}}
```

Or customize inline for specific cases:

```tsx
transition={{ duration: 0.5, delay: 0.1 }}
```

## Timeline Features

### Month Indicators

The Timeline view displays month names at the top, showing which months each cycle spans.

### Editable Cycle Labels

Click on the cycle markers to add custom labels:

- Click the marker at the end of each 6+1 cycle
- Type your label (e.g., "Q1 Review", "Sprint 3")
- Click ✓ to save or ✕ to cancel
- Labels persist throughout your session

## Project Structure

```
6week/
├── app/                    # Next.js pages
│   ├── page.tsx           # Demo page
│   └── layout.tsx         # Root layout
├── components/
│   ├── calendar/          # Calendar components
│   │   ├── CalendarView.tsx   # Main container
│   │   ├── YearTimeline.tsx   # Timeline view
│   │   ├── MonthGrid.tsx      # Month view
│   │   ├── AgendaList.tsx     # Agenda view
│   │   └── Legend.tsx         # Controls
│   └── icons/             # Reusable icons
│       ├── SunIcon.tsx    # Sun icon
│       ├── MoonIcon.tsx   # Moon icon
│       └── index.ts       # Icon exports
├── hooks/
│   └── useCycleLogic.ts   # State management
└── lib/calendar/
    ├── cycle-logic.ts     # Core functions
    ├── types.ts           # TypeScript types
    └── constants.ts       # Configuration constants
```

## Performance & Quality

### Bundle Analysis

Analyze your bundle size:

```bash
npm run analyze
```

Opens an interactive visualization of your bundle composition.

### Structured Logging

Use Pino for production-grade logging:

```tsx
import { createLogger } from '@/lib/logger';

const log = createLogger('MyComponent');

log.info('Component mounted');
log.error({ error }, 'Failed to load data');
```

### React Compiler

The React 19 Compiler is enabled by default - it automatically optimizes your components. No manual `useMemo`/`useCallback` needed!

### OpenTelemetry

Distributed tracing is enabled via `instrumentation.ts` for production observability.

## Next Steps

- 📖 Read [USAGE.md](./USAGE.md) for detailed examples
- 🛠️ See [CONTRIBUTING.md](./CONTRIBUTING.md) to contribute
- 📋 Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for architecture

## Need Help?

- Check the demo at `app/page.tsx`
- Review tests in `lib/calendar/cycle-logic.test.ts`
- Open an issue on GitHub

---

**You're ready to go!** 🚀

---

**Project**: [6week-2026](https://github.com/iamkeremaydin/6week-2026) by [@iamkeremaydin](https://github.com/iamkeremaydin) | **Demo**: https://6week-2026.vercel.app/

