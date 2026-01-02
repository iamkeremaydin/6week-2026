/**
 * Type definitions for the calendar cycle system.
 * Core types represent work/rest blocks and their temporal relationships.
 */

/** Work or rest period designation. */
export type BlockType = "work" | "rest";

/**
 * A single week block within a cycle.
 * Each block tracks its position within its parent cycle and has precise date boundaries.
 */
export type Block = {
  type: BlockType;
  cycleNumber: number;
  weekInCycle: number;
  start: Date;
  end: Date;
};

/**
 * Configuration for generating cycle patterns.
 * Controls when cycles start and how many weeks of each type per cycle.
 */
export type CycleConfig = {
  cycleStartDate: Date;
  workWeeks: number;
  restWeeks: number;
  weekStartsOn: WeekStartDay;
};

/** Day that weeks start on: 0 = Sunday, 1 = Monday. */
export type WeekStartDay = 0 | 1;

/** Criteria for filtering visible blocks. */
export type FilterOptions = {
  blockType?: BlockType | "all";
  cycleNumber?: number;
};

/** Month positioning data for timeline rendering. */
export type MonthRange = {
  month: string;
  startIndex: number;
  width: number;
};

/** User-defined labels for cycles, keyed by cycle number. */
export type CycleLabels = Record<number, string>;

/** Available calendar view modes. */
export type ViewMode = "timeline" | "month" | "agenda";

/** Callback signature for cycle label changes. */
export type CycleLabelChangeHandler = (cycleNumber: number, label: string) => void;

