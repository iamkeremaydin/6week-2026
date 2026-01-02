"use client";

import { m } from "motion/react";
import type { FilterOptions, BlockType } from "@/lib/calendar/types";

interface LegendProps {
  totalCycles: number;
  currentCycleNumber?: number;
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
}

/**
 * Sidebar component displaying cycle information and filter controls.
 * Shows current cycle, legend, and provides filtering by block type or cycle number.
 */
export function Legend({
  totalCycles,
  currentCycleNumber,
  filterOptions,
  onFilterChange,
}: LegendProps) {
  const blockTypes: Array<{ value: BlockType | "all"; label: string }> = [
    { value: "all", label: "All Weeks" },
    { value: "work", label: "Work Weeks" },
    { value: "rest", label: "Rest Weeks" },
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Calendar Legend</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Filter and customize your view
        </p>
      </div>

      {/* Block type indicators */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-work-400 dark:bg-work-600 shadow-sm" />
          <div>
            <p className="font-medium text-sm">Work Week</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              6 weeks of focused work
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-rest-400 dark:bg-rest-600 shadow-sm" />
          <div>
            <p className="font-medium text-sm">Rest Week</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              1 week of rest and recovery
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
        {/* Cycle info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Total Cycles
          </p>
          <p className="text-2xl font-bold">{totalCycles}</p>
          {currentCycleNumber && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              Currently in cycle #{currentCycleNumber}
            </p>
          )}
        </div>

        {/* Filter by type */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
            Filter by Type
          </label>
          <div className="flex gap-2">
            {blockTypes.map((type) => (
              <m.button
                key={type.value}
                onClick={() =>
                  onFilterChange({ ...filterOptions, blockType: type.value })
                }
                className={`
                  flex-1 px-3 py-2 rounded-lg text-xs font-medium
                  transition-colors duration-200
                  ${
                    filterOptions.blockType === type.value
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {type.label}
              </m.button>
            ))}
          </div>
        </div>

        {/* Filter by cycle */}
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
            Filter by Cycle
          </label>
          <div className="flex gap-2">
            <m.button
              onClick={() =>
                onFilterChange({ ...filterOptions, cycleNumber: undefined })
              }
              className={`
                px-3 py-2 rounded-lg text-xs font-medium
                transition-colors duration-200
                ${
                  !filterOptions.cycleNumber
                    ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              All
            </m.button>
            <select
              value={filterOptions.cycleNumber || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filterOptions,
                  cycleNumber: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <option value="">Select cycle...</option>
              {Array.from({ length: totalCycles }, (_, i) => i + 1).map(
                (cycle) => (
                  <option key={cycle} value={cycle}>
                    Cycle {cycle}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Reset filters */}
        {(filterOptions.blockType !== "all" || filterOptions.cycleNumber) && (
          <m.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() =>
              onFilterChange({ blockType: "all", cycleNumber: undefined })
            }
            className="w-full px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Reset Filters
          </m.button>
        )}
      </div>
    </m.div>
  );
}

