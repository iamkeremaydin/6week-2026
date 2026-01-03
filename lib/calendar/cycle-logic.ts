/**
 * Core cycle calculation logic for generating work/rest block patterns.
 * Handles partial cycles at year boundaries and maintains cycle numbering across the year.
 */

import { addWeeks, startOfWeek, differenceInWeeks, isWithinInterval, startOfDay, isAfter, isBefore, isEqual } from "date-fns";
import type { Block, CycleConfig, BlockType } from "./types";

/**
 * Generates work/rest blocks for a calendar year based on configurable cycle patterns.
 * Handles partial cycles at year boundaries by starting before the year if needed.
 * 
 * @param config - Cycle configuration with start date and week counts
 * @param year - Target calendar year for block generation
 * @returns Chronologically sorted blocks covering the year, clipped to year boundaries
 * @example
 * ```ts
 * const blocks = buildSixPlusOneBlocks({
 *   cycleStartDate: new Date(2026, 0, 1),
 *   workWeeks: 6,
 *   restWeeks: 1,
 *   weekStartsOn: 1
 * }, 2026);
 * ```
 */
export function buildSixPlusOneBlocks(
  config: CycleConfig,
  year: number
): Block[] {
  const { cycleStartDate, workWeeks = 6, restWeeks = 1, weekStartsOn = 1 } = config;
  
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  
  let cursor = startOfWeek(cycleStartDate, { weekStartsOn });
  const blocks: Block[] = [];
  const cycleLength = workWeeks + restWeeks;
  
  // Rewind to before year start to capture partial cycles
  while (cursor > yearStart) {
    cursor = addWeeks(cursor, -(cycleLength));
  }
  
  let cycleNumber = 1;
  
  while (cursor < yearEnd) {
    const workStart = cursor;
    const workEnd = addWeeks(workStart, workWeeks);
    
    for (let weekNum = 1; weekNum <= workWeeks; weekNum++) {
      const weekStart = addWeeks(workStart, weekNum - 1);
      const weekEnd = addWeeks(weekStart, 1);
      
      if (weekEnd > yearStart && weekStart < yearEnd) {
        blocks.push({
          type: "work",
          cycleNumber,
          weekInCycle: weekNum,
          start: weekStart < yearStart ? yearStart : weekStart,
          end: weekEnd > yearEnd ? yearEnd : weekEnd,
        });
      }
    }
    
    const restStart = workEnd;
    const restEnd = addWeeks(restStart, restWeeks);
    
    for (let weekNum = 1; weekNum <= restWeeks; weekNum++) {
      const weekStart = addWeeks(restStart, weekNum - 1);
      const weekEnd = addWeeks(weekStart, 1);
      
      if (weekEnd > yearStart && weekStart < yearEnd) {
        blocks.push({
          type: "rest",
          cycleNumber,
          weekInCycle: workWeeks + weekNum,
          start: weekStart < yearStart ? yearStart : weekStart,
          end: weekEnd > yearEnd ? yearEnd : weekEnd,
        });
      }
    }
    
    cursor = restEnd;
    cycleNumber++;
  }
  
  return blocks;
}

/**
 * Locates which work/rest block contains a given date.
 * Uses start-of-day normalization to avoid time component issues.
 * 
 * @param date - Target date to locate
 * @param blocks - Blocks to search through
 * @returns Matching block or undefined if date falls outside all blocks
 */
export function getBlockForDate(date: Date, blocks: Block[]): Block | undefined {
  // Normalize date to start of day for consistent comparison
  const normalizedDate = startOfDay(date);
  
  return blocks.find((block) => {
    // Normalize block boundaries to start of day
    const blockStart = startOfDay(block.start);
    const blockEnd = startOfDay(block.end); // block.end is exclusive, so this is the first day NOT in the block
    
    // Date is in block if: date >= blockStart AND date < blockEnd
    return (
      (isAfter(normalizedDate, blockStart) || isEqual(normalizedDate, blockStart)) &&
      isBefore(normalizedDate, blockEnd)
    );
  });
}

/**
 * Determines cycle number for a date based on week offset from cycle start.
 * 
 * @param date - Date to check
 * @param cycleStartDate - First cycle's start date
 * @param cycleLength - Total weeks per cycle (default: 7)
 * @returns 1-indexed cycle number
 */
export function getCycleNumber(
  date: Date,
  cycleStartDate: Date,
  cycleLength: number = 7
): number {
  const weeksDiff = differenceInWeeks(date, cycleStartDate);
  return Math.floor(weeksDiff / cycleLength) + 1;
}

/** Filters blocks by type (work/rest). */
export function getBlocksByType(blocks: Block[], type: BlockType): Block[] {
  return blocks.filter((block) => block.type === type);
}

/** Filters blocks belonging to a specific cycle number. */
export function getBlocksByCycle(blocks: Block[], cycleNumber: number): Block[] {
  return blocks.filter((block) => block.cycleNumber === cycleNumber);
}

/** Counts distinct cycles in the block array. */
export function getTotalCycles(blocks: Block[]): number {
  const uniqueCycles = new Set(blocks.map((block) => block.cycleNumber));
  return uniqueCycles.size;
}

/** Checks if date falls within a work week. */
export function isWorkWeek(date: Date, blocks: Block[]): boolean {
  const block = getBlockForDate(date, blocks);
  return block?.type === "work";
}

/** Checks if date falls within a rest week. */
export function isRestWeek(date: Date, blocks: Block[]): boolean {
  const block = getBlockForDate(date, blocks);
  return block?.type === "rest";
}

