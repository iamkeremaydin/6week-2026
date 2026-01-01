# Usage Guide

Comprehensive guide to using the 6+1 Week Cycle Calendar component.

## Table of Contents

- [Quick Start](#quick-start)
- [Component API](#component-api)
- [Hook API](#hook-api)
- [Core Functions](#core-functions)
- [Examples](#examples)
- [Customization](#customization)

## Quick Start

### 1. Basic Integration

The simplest way to use the calendar:

```tsx
import { CalendarView } from "@/components/calendar/CalendarView";

export default function MyPage() {
  return <CalendarView year={2026} />;
}
```

This will display a full calendar for 2026 with default settings (6 work weeks + 1 rest week, starting January 1st).

### 2. Custom Configuration

Customize the cycle parameters:

```tsx
<CalendarView
  year={2026}
  cycleStartDate={new Date(2026, 2, 15)} // Start mid-March
  workWeeks={4}                           // 4 weeks of work
  restWeeks={2}                           // 2 weeks of rest
  weekStartsOn={0}                        // Week starts on Sunday
/>
```

## Component API

### CalendarView

The main component that includes all three view modes and controls.

#### Props

```typescript
interface CalendarViewProps {
  year?: number;           // Default: current year
  cycleStartDate?: Date;   // Default: January 1st of year
  workWeeks?: number;      // Default: 6
  restWeeks?: number;      // Default: 1
  weekStartsOn?: 0 | 1;   // Default: 1 (Monday)
}
```

#### Example

```tsx
<CalendarView
  year={2026}
  cycleStartDate={new Date(2026, 0, 1)}
  workWeeks={6}
  restWeeks={1}
  weekStartsOn={1}
/>
```

### Individual View Components

You can also use the view components separately:

#### YearTimeline

Horizontal timeline showing all weeks in sequence.

```tsx
import { YearTimeline } from "@/components/calendar/YearTimeline";

<YearTimeline 
  blocks={blocks}
  currentBlock={currentBlock}
/>
```

#### MonthGrid

Traditional monthly calendar grid.

```tsx
import { MonthGrid } from "@/components/calendar/MonthGrid";

<MonthGrid
  blocks={blocks}
  year={2026}
  getBlockForDate={getBlockForDate}
/>
```

#### AgendaList

List view with expandable week details.

```tsx
import { AgendaList } from "@/components/calendar/AgendaList";

<AgendaList
  blocks={filteredBlocks}
  currentBlock={currentBlock}
/>
```

#### Legend

Controls and filters sidebar.

```tsx
import { Legend } from "@/components/calendar/Legend";

<Legend
  totalCycles={totalCycles}
  currentCycleNumber={currentBlock?.cycleNumber}
  filterOptions={filterOptions}
  onFilterChange={setFilterOptions}
/>
```

## Hook API

### useCycleLogic

Custom React hook for managing calendar state.

#### Interface

```typescript
interface UseCycleLogicProps {
  year: number;
  cycleStartDate: Date;
  workWeeks?: number;      // Default: 6
  restWeeks?: number;      // Default: 1
  weekStartsOn?: 0 | 1;   // Default: 1
}

interface UseCycleLogicReturn {
  blocks: Block[];                          // All blocks for the year
  filteredBlocks: Block[];                  // Filtered based on filterOptions
  totalCycles: number;                      // Total number of cycles
  currentBlock: Block | undefined;          // Block containing today
  filterOptions: FilterOptions;             // Current filter state
  setFilterOptions: (options: FilterOptions) => void;
  getBlockForDate: (date: Date) => Block | undefined;
  isWorkWeek: (date: Date) => boolean;
  isRestWeek: (date: Date) => boolean;
}
```

#### Example

```tsx
import { useCycleLogic } from "@/hooks/useCycleLogic";

function MyComponent() {
  const {
    blocks,
    filteredBlocks,
    totalCycles,
    currentBlock,
    filterOptions,
    setFilterOptions,
  } = useCycleLogic({
    year: 2026,
    cycleStartDate: new Date(2026, 0, 1),
  });

  return (
    <div>
      <p>Total cycles: {totalCycles}</p>
      <p>Current cycle: {currentBlock?.cycleNumber}</p>
      <button onClick={() => setFilterOptions({ blockType: "work" })}>
        Show only work weeks
      </button>
      {/* Render your custom UI */}
    </div>
  );
}
```

## Core Functions

Pure TypeScript functions for cycle calculations.

### buildSixPlusOneBlocks

Generates all work/rest blocks for a year.

```typescript
import { buildSixPlusOneBlocks } from "@/lib/calendar/cycle-logic";

const blocks = buildSixPlusOneBlocks(
  {
    cycleStartDate: new Date(2026, 0, 1),
    workWeeks: 6,
    restWeeks: 1,
    weekStartsOn: 1,
  },
  2026
);
// Returns: Block[]
```

### getBlockForDate

Find which block contains a specific date.

```typescript
import { getBlockForDate } from "@/lib/calendar/cycle-logic";

const date = new Date(2026, 5, 15);
const block = getBlockForDate(date, blocks);

if (block) {
  console.log(`${date} is in a ${block.type} week`);
  console.log(`Cycle ${block.cycleNumber}, Week ${block.weekInCycle}`);
}
```

### getCycleNumber

Calculate the cycle number for a date.

```typescript
import { getCycleNumber } from "@/lib/calendar/cycle-logic";

const cycleNum = getCycleNumber(
  new Date(2026, 6, 1),
  new Date(2026, 0, 1),
  7 // cycle length (6 work + 1 rest)
);
```

### Filtering Functions

```typescript
import {
  getBlocksByType,
  getBlocksByCycle,
  getTotalCycles,
} from "@/lib/calendar/cycle-logic";

// Get only work weeks
const workWeeks = getBlocksByType(blocks, "work");

// Get all weeks in cycle 3
const cycle3 = getBlocksByCycle(blocks, 3);

// Count total cycles
const total = getTotalCycles(blocks);
```

### Checking Functions

```typescript
import { isWorkWeek, isRestWeek } from "@/lib/calendar/cycle-logic";

const date = new Date(2026, 3, 15);

if (isWorkWeek(date, blocks)) {
  console.log("Time to work!");
} else if (isRestWeek(date, blocks)) {
  console.log("Time to rest!");
}
```

## Examples

### Example 1: Simple Calendar Display

```tsx
import { CalendarView } from "@/components/calendar/CalendarView";

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">My Schedule</h1>
      <CalendarView year={2026} />
    </div>
  );
}
```

### Example 2: Custom Cycle Configuration

```tsx
import { CalendarView } from "@/components/calendar/CalendarView";

export default function Page() {
  // Academic semester: 10 weeks work, 2 weeks break
  return (
    <CalendarView
      year={2026}
      cycleStartDate={new Date(2026, 8, 1)} // September 1
      workWeeks={10}
      restWeeks={2}
      weekStartsOn={1}
    />
  );
}
```

### Example 3: Using the Hook with Custom UI

```tsx
import { useCycleLogic } from "@/hooks/useCycleLogic";
import { format } from "date-fns";

export default function CustomCalendar() {
  const { blocks, currentBlock, totalCycles } = useCycleLogic({
    year: 2026,
    cycleStartDate: new Date(2026, 0, 1),
  });

  return (
    <div>
      <h2>Stats</h2>
      <p>Total cycles: {totalCycles}</p>
      {currentBlock && (
        <p>
          Currently in {currentBlock.type} week
          (Cycle {currentBlock.cycleNumber}, Week {currentBlock.weekInCycle})
        </p>
      )}

      <h2>All Weeks</h2>
      <ul>
        {blocks.map((block, i) => (
          <li key={i}>
            {format(block.start, "MMM d")} - {block.type}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Example 4: Programmatic Calendar Generation

```tsx
import { buildSixPlusOneBlocks } from "@/lib/calendar/cycle-logic";

// Generate calendar data for an API or export
export async function generateCalendarData(year: number) {
  const blocks = buildSixPlusOneBlocks(
    {
      cycleStartDate: new Date(year, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    },
    year
  );

  return {
    year,
    totalCycles: Math.max(...blocks.map(b => b.cycleNumber)),
    blocks: blocks.map(block => ({
      type: block.type,
      cycle: block.cycleNumber,
      week: block.weekInCycle,
      start: block.start.toISOString(),
      end: block.end.toISOString(),
    })),
  };
}
```

## Customization

### Theming

#### Colors

Customize work/rest colors in `tailwind.config.ts`:

```typescript
colors: {
  work: {
    50: "#your-color",
    // ... through
    900: "#your-color",
  },
  rest: {
    50: "#your-color",
    // ... through
    900: "#your-color",
  },
}
```

#### Dark Mode

The component automatically supports dark mode via Tailwind's `dark:` classes. Toggle dark mode:

```tsx
// In your app
document.documentElement.classList.toggle("dark");
```

### Animations

Adjust animation settings in component files:

```tsx
// In YearTimeline.tsx, MonthGrid.tsx, etc.
transition={{
  duration: 0.5,        // Adjust timing
  delay: index * 0.02,  // Adjust stagger
  ease: [0.19, 1, 0.22, 1], // Custom easing
}}
```

### Typography

Update fonts in `app/layout.tsx` or `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font');

body {
  font-family: 'Your Font', sans-serif;
}
```

## Advanced Usage

### Multi-Year View

```tsx
function MultiYearCalendar() {
  const years = [2026, 2027, 2028];
  
  return (
    <div className="space-y-12">
      {years.map(year => (
        <div key={year}>
          <h2>{year}</h2>
          <CalendarView year={year} />
        </div>
      ))}
    </div>
  );
}
```

### Export to ICS/Calendar Format

```typescript
import { buildSixPlusOneBlocks } from "@/lib/calendar/cycle-logic";
import { format } from "date-fns";

function generateICS(year: number) {
  const blocks = buildSixPlusOneBlocks(
    { cycleStartDate: new Date(year, 0, 1), workWeeks: 6, restWeeks: 1, weekStartsOn: 1 },
    year
  );

  const events = blocks
    .filter(b => b.type === "rest")
    .map(block => {
      return `BEGIN:VEVENT
SUMMARY:Rest Week
DTSTART:${format(block.start, "yyyyMMdd")}
DTEND:${format(block.end, "yyyyMMdd")}
END:VEVENT`;
    })
    .join("\n");

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//6+1 Calendar//EN
${events}
END:VCALENDAR`;
}
```

---

For more examples, see the demo page in `app/page.tsx`.

