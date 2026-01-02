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
 * Manages calendar cycle state and provides filtered block data.
 * Handles block generation, filtering, and date queries with memoization for performance.
 * 
 * @param props - Calendar configuration and cycle parameters
 * @returns Memoized blocks, current block, filters, and utility functions
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

  const blocks = useMemo(() => {
    const config: CycleConfig = {
      cycleStartDate,
      workWeeks,
      restWeeks,
      weekStartsOn,
    };
    return buildSixPlusOneBlocks(config, year);
  }, [year, cycleStartDate, workWeeks, restWeeks, weekStartsOn]);

  const filteredBlocks = useMemo(() => {
    let result = blocks;

    if (filterOptions.blockType && filterOptions.blockType !== "all") {
      result = getBlocksByType(result, filterOptions.blockType as BlockType);
    }

    if (filterOptions.cycleNumber) {
      result = getBlocksByCycle(result, filterOptions.cycleNumber);
    }

    return result;
  }, [blocks, filterOptions]);

  const totalCycles = useMemo(() => getTotalCycles(blocks), [blocks]);

  const currentBlock = useMemo(() => {
    const today = new Date();
    return getBlockForDate(today, blocks);
  }, [blocks]);

  const getBlockForDateFn = (date: Date): Block | undefined => {
    return getBlockForDate(date, blocks);
  };

  const isWorkWeek = (date: Date): boolean => {
    const block = getBlockForDate(date, blocks);
    return block?.type === "work";
  };

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

