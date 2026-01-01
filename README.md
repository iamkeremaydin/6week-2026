# 6+1 Week Cycle Calendar

Calendar component for 6-week work + 1-week rest cycles.

## Install

```bash
npm install
npm run dev
```

## Usage

```tsx
import { CalendarView } from "@/components/calendar/CalendarView";

<CalendarView year={2026} cycleStartDate={new Date(2026, 0, 1)} />
```

## Features

- Three view modes: Timeline, Month, Agenda
- Dark mode support
- Filtering by work/rest weeks
- Editable cycle labels

## Documentation

- [Quick Start](./QUICKSTART.md)
- [Usage Guide](./USAGE.md)
- [Contributing](./CONTRIBUTING.md)

## Stack

Next.js • React 19 • TypeScript • Tailwind CSS • Motion

## License

MIT

