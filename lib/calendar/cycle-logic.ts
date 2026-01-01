import { addWeeks, startOfWeek, differenceInWeeks, isWithinInterval } from "date-fns";
import type { Block, CycleConfig, BlockType } from "./types";

/**
 * Builds an array of work/rest blocks for a given year based on the configurable cycle pattern.
 * Each cycle consists of N work weeks followed by M rest weeks.
 * 
 * @param config - Configuration object containing cycle parameters
 * @param config.cycleStartDate - The start date of the first cycle
 * @param config.workWeeks - Number of work weeks in each cycle (default: 6)
 * @param config.restWeeks - Number of rest weeks in each cycle (default: 1)
 * @param config.weekStartsOn - Day of the week that weeks start on (0 = Sunday, 1 = Monday)
 * @param year - The calendar year to generate blocks for
 * @returns Array of Block objects covering the specified year, sorted chronologically
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
  
  // Start from before the year if needed to catch partial cycles
  while (cursor > yearStart) {
    cursor = addWeeks(cursor, -(cycleLength));
  }
  
  let cycleNumber = 1;
  
  while (cursor < yearEnd) {
    // Add work block
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
    
    // Add rest block
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
 * Finds the block that contains a specific date by checking if the date falls
 * within the start and end boundaries of any block.
 * 
 * @param date - The date to search for
 * @param blocks - Array of blocks to search within
 * @returns The Block containing the date, or undefined if not found
 */
export function getBlockForDate(date: Date, blocks: Block[]): Block | undefined {
  return blocks.find((block) =>
    isWithinInterval(date, { start: block.start, end: addWeeks(block.end, -0.001) })
  );
}

/**
 * Calculates which cycle a given date belongs to, starting from cycle 1.
 * 
 * @param date - The date to calculate the cycle for
 * @param cycleStartDate - The start date of the first cycle
 * @param cycleLength - Total weeks in one complete cycle (workWeeks + restWeeks, default: 7)
 * @returns The cycle number, 1-indexed
 */
export function getCycleNumber(
  date: Date,
  cycleStartDate: Date,
  cycleLength: number = 7
): number {
  const weeksDiff = differenceInWeeks(date, cycleStartDate);
  return Math.floor(weeksDiff / cycleLength) + 1;
}

/**
 * Gets all blocks of a specific type.
 * @param blocks - Array of all blocks
 * @param type - The block type to filter by
 * @returns Filtered array of blocks
 */
export function getBlocksByType(blocks: Block[], type: BlockType): Block[] {
  return blocks.filter((block) => block.type === type);
}

/**
 * Gets all blocks for a specific cycle number.
 * @param blocks - Array of all blocks
 * @param cycleNumber - The cycle number to filter by
 * @returns Filtered array of blocks
 */
export function getBlocksByCycle(blocks: Block[], cycleNumber: number): Block[] {
  return blocks.filter((block) => block.cycleNumber === cycleNumber);
}

/**
 * Gets the total number of unique cycles in the blocks array.
 * @param blocks - Array of all blocks
 * @returns Number of unique cycles
 */
export function getTotalCycles(blocks: Block[]): number {
  const uniqueCycles = new Set(blocks.map((block) => block.cycleNumber));
  return uniqueCycles.size;
}

/**
 * Checks if a given date falls within a work week.
 * @param date - The date to check
 * @param blocks - Array of all blocks
 * @returns True if the date is in a work week, false otherwise
 */
export function isWorkWeek(date: Date, blocks: Block[]): boolean {
  const block = getBlockForDate(date, blocks);
  return block?.type === "work";
}

/**
 * Checks if a given date falls within a rest week.
 * @param date - The date to check
 * @param blocks - Array of all blocks
 * @returns True if the date is in a rest week, false otherwise
 */
export function isRestWeek(date: Date, blocks: Block[]): boolean {
  const block = getBlockForDate(date, blocks);
  return block?.type === "rest";
}

