import { describe, it, expect } from "vitest";
import {
  buildSixPlusOneBlocks,
  getBlockForDate,
  getCycleNumber,
  getBlocksByType,
  getBlocksByCycle,
  getTotalCycles,
  isWorkWeek,
  isRestWeek,
} from "./cycle-logic";
import type { CycleConfig } from "./types";

describe("buildSixPlusOneBlocks", () => {
  it("should generate correct number of blocks for a year", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1), // Jan 1, 2026
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1, // Monday
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    
    // 52 weeks in a year, 7 weeks per cycle = ~7-8 cycles * 7 blocks each
    expect(blocks.length).toBeGreaterThan(0);
    expect(blocks.length).toBeLessThanOrEqual(56); // Max ~52 weeks
  });
  
  it("should alternate between work and rest blocks", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    
    // Check first few blocks alternate correctly by cycle
    const cycle1 = blocks.filter(b => b.cycleNumber === 1);
    const workBlocks = cycle1.filter(b => b.type === "work");
    const restBlocks = cycle1.filter(b => b.type === "rest");
    
    expect(workBlocks.length).toBe(6);
    expect(restBlocks.length).toBe(1);
  });
  
  it("should have correct cycle numbers", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    
    // First block should be cycle 1
    expect(blocks[0].cycleNumber).toBe(1);
    
    // Cycle numbers should be sequential
    const cycles = Array.from(new Set(blocks.map(b => b.cycleNumber)));
    expect(cycles).toEqual(cycles.sort((a, b) => a - b));
  });
  
  it("should have correct week in cycle numbering", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    const cycle1 = blocks.filter(b => b.cycleNumber === 1);
    
    // Work weeks should be numbered 1-6
    const workWeeks = cycle1.filter(b => b.type === "work");
    expect(workWeeks.map(b => b.weekInCycle)).toEqual([1, 2, 3, 4, 5, 6]);
    
    // Rest week should be numbered 7
    const restWeeks = cycle1.filter(b => b.type === "rest");
    expect(restWeeks[0].weekInCycle).toBe(7);
  });
});

describe("getBlockForDate", () => {
  it("should find the correct block for a given date", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    const testDate = new Date(2026, 0, 15); // Mid-January
    
    const block = getBlockForDate(testDate, blocks);
    
    expect(block).toBeDefined();
    expect(testDate >= block!.start).toBe(true);
    expect(testDate < block!.end).toBe(true);
  });
  
  it("should return undefined for date outside blocks", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    const testDate = new Date(2025, 0, 1); // Different year
    
    const block = getBlockForDate(testDate, blocks);
    
    expect(block).toBeUndefined();
  });
});

describe("getCycleNumber", () => {
  it("should calculate correct cycle number", () => {
    const cycleStartDate = new Date(2026, 0, 1);
    
    // Same date should be cycle 1
    expect(getCycleNumber(cycleStartDate, cycleStartDate, 7)).toBe(1);
    
    // 7 weeks later should be cycle 2
    const sevenWeeksLater = new Date(2026, 1, 19);
    expect(getCycleNumber(sevenWeeksLater, cycleStartDate, 7)).toBe(2);
  });
});

describe("getBlocksByType", () => {
  it("should filter blocks by type", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    
    const workBlocks = getBlocksByType(blocks, "work");
    const restBlocks = getBlocksByType(blocks, "rest");
    
    expect(workBlocks.every(b => b.type === "work")).toBe(true);
    expect(restBlocks.every(b => b.type === "rest")).toBe(true);
    expect(workBlocks.length).toBeGreaterThan(restBlocks.length);
  });
});

describe("getBlocksByCycle", () => {
  it("should filter blocks by cycle number", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    
    const cycle1Blocks = getBlocksByCycle(blocks, 1);
    
    expect(cycle1Blocks.every(b => b.cycleNumber === 1)).toBe(true);
    expect(cycle1Blocks.length).toBe(7); // 6 work + 1 rest
  });
});

describe("getTotalCycles", () => {
  it("should count unique cycles", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    const totalCycles = getTotalCycles(blocks);
    
    // Should be around 7-8 cycles for a full year
    expect(totalCycles).toBeGreaterThanOrEqual(7);
    expect(totalCycles).toBeLessThanOrEqual(9);
  });
});

describe("isWorkWeek and isRestWeek", () => {
  it("should correctly identify work and rest weeks", () => {
    const config: CycleConfig = {
      cycleStartDate: new Date(2026, 0, 1),
      workWeeks: 6,
      restWeeks: 1,
      weekStartsOn: 1,
    };
    
    const blocks = buildSixPlusOneBlocks(config, 2026);
    
    // First week should be work
    const firstWeek = new Date(2026, 0, 5);
    expect(isWorkWeek(firstWeek, blocks)).toBe(true);
    expect(isRestWeek(firstWeek, blocks)).toBe(false);
    
    // Find a rest week and test it
    const restBlock = blocks.find(b => b.type === "rest");
    if (restBlock) {
      const restDate = new Date(restBlock.start.getTime() + 1000 * 60 * 60 * 24); // Add a day
      expect(isRestWeek(restDate, blocks)).toBe(true);
      expect(isWorkWeek(restDate, blocks)).toBe(false);
    }
  });
});

