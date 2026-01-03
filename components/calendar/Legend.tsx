"use client";

import { m } from "motion/react";
import { useTranslations } from 'next-intl';
import { useCycleNaming } from "@/lib/context/CycleNamingContext";
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
  const t = useTranslations('legend');
  const { getCycleName } = useCycleNaming();

  const blockTypes: Array<{ value: BlockType | "all"; label: string }> = [
    { value: "all", label: t('allWeeks') },
    { value: "work", label: t('workWeeks') },
    { value: "rest", label: t('restWeeks') },
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-5 sm:p-4 md:p-6 shadow-lg border border-gray-200 dark:border-gray-800"
    >
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{t('title')}</h3>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>

      {/* Block type indicators */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-work-400 dark:bg-work-600 shadow-sm" />
          <div>
            <p className="font-medium text-sm sm:text-base">{t('workWeekLabel')}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t('workWeekDesc')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-rest-400 dark:bg-rest-600 shadow-sm" />
          <div>
            <p className="font-medium text-sm sm:text-base">{t('restWeekLabel')}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {t('restWeekDesc')}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 sm:pt-6 space-y-3 sm:space-y-4">
        {/* Cycle info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 sm:p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('totalCycles')}
          </p>
          <p className="text-xl sm:text-2xl font-bold">{totalCycles}</p>
          {currentCycleNumber && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {t('currentlyInCycle')}{currentCycleNumber}
            </p>
          )}
        </div>

        {/* Filter by type */}
        <div>
          <label className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 mb-2 block">
            {t('filterByType')}
          </label>
          <div className="flex gap-1 sm:gap-2">
            {blockTypes.map((type) => (
              <m.button
                key={type.value}
                onClick={() =>
                  onFilterChange({ ...filterOptions, blockType: type.value })
                }
                className={`
                  flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium
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
          <label className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 mb-2 block">
            {t('filterByCycle')}
          </label>
          <div className="flex gap-1 sm:gap-2">
            <m.button
              onClick={() =>
                onFilterChange({ ...filterOptions, cycleNumber: undefined })
              }
              className={`
                px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium
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
              {t('all')}
            </m.button>
            <select
              value={filterOptions.cycleNumber || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filterOptions,
                  cycleNumber: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="flex-1 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <option value="">{t('selectCycle')}</option>
              {Array.from({ length: totalCycles }, (_, i) => i + 1).map(
                (cycle) => {
                  const cycleName = getCycleName(cycle);
                  return (
                    <option key={cycle} value={cycle}>
                      {cycleName || t('cycleNumber', { number: cycle })}
                    </option>
                  );
                }
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
            className="w-full px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {t('resetFilters')}
          </m.button>
        )}
      </div>
    </m.div>
  );
}

