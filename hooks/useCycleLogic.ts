"use client";

import { useMemo, useState } from "react";
import {
  buildSixPlusOneBlocks,
  getBlocksByType,
  getBlocksByCycle,
  getTotalCycles,
  getBlockForDate,
} from "@/lib/calendar/cycle-logic";
import type { Block, CycleConfig, FilterOptions, BlockType } from "@/lib/calendar/types";

export interface UseCycleLogicProps {
  year: number;
  cycleStartDate: Date;
  workWeeks?: number;
  restWeeks?: number;
  weekStartsOn?: 0 | 1;
}

export interface UseCycleLogicReturn {
  blocks: Block[];
  filteredBlocks: Block[];
  totalCycles: number;
  currentBlock: Block | undefined;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  getBlockForDate: (date: Date) => Block | undefined;
  isWorkWeek: (date: Date) => boolean;
  isRestWeek: (date: Date) => boolean;
}

/**
 * Custom React hook for managing 6+1 cycle calendar logic and state.
 * 
 * This hook handles:
 * - Generating all blocks for a given year
 * - Filtering blocks based on type or cycle number
 * - Identifying the current block (week)
 * - Providing utility functions for date queries
 * 
 * All expensive calculations are memoized for optimal performance.
 * 
 * @param props - Configuration for the calendar
 * @returns Object containing blocks, filters, and utility functions
 * @example
 * ```tsx
 * const { blocks, currentBlock, setFilterOptions } = useCycleLogic({
 *   year: 2026,
 *   cycleStartDate: new Date(2026, 0, 1),
 *   workWeeks: 6,
 *   restWeeks: 1
 * });
 * ```
 */
export function useCycleLogic({
  year,
  cycleStartDate,
  workWeeks = 6,
  restWeeks = 1,
  weekStartsOn = 1,
}: UseCycleLogicProps): UseCycleLogicReturn {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    blockType: "all",
  });

  // Generate all blocks for the year (memoized)
  const blocks = useMemo(() => {
    const config: CycleConfig = {
      cycleStartDate,
      workWeeks,
      restWeeks,
      weekStartsOn,
    };
    return buildSixPlusOneBlocks(config, year);
  }, [year, cycleStartDate, workWeeks, restWeeks, weekStartsOn]);

  // Filter blocks based on current filter options (memoized)
  const filteredBlocks = useMemo(() => {
    let result = blocks;

    // Filter by block type
    if (filterOptions.blockType && filterOptions.blockType !== "all") {
      result = getBlocksByType(result, filterOptions.blockType as BlockType);
    }

    // Filter by cycle number
    if (filterOptions.cycleNumber) {
      result = getBlocksByCycle(result, filterOptions.cycleNumber);
    }

    return result;
  }, [blocks, filterOptions]);

  // Get total number of cycles (memoized)
  const totalCycles = useMemo(() => getTotalCycles(blocks), [blocks]);

  // Get current block for today (memoized)
  const currentBlock = useMemo(() => {
    const today = new Date();
    return getBlockForDate(today, blocks);
  }, [blocks]);

  // Utility function to get block for a specific date
  const getBlockForDateFn = (date: Date): Block | undefined => {
    return getBlockForDate(date, blocks);
  };

  // Check if a date is in a work week
  const isWorkWeek = (date: Date): boolean => {
    const block = getBlockForDate(date, blocks);
    return block?.type === "work";
  };

  // Check if a date is in a rest week
  const isRestWeek = (date: Date): boolean => {
    const block = getBlockForDate(date, blocks);
    return block?.type === "rest";
  };

  return {
    blocks,
    filteredBlocks,
    totalCycles,
    currentBlock,
    filterOptions,
    setFilterOptions,
    getBlockForDate: getBlockForDateFn,
    isWorkWeek,
    isRestWeek,
  };
}

