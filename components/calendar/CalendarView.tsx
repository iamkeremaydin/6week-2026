"use client";

import { m, AnimatePresence } from "motion/react";
import { useState, lazy, Suspense } from "react";
import { useTranslations } from 'next-intl';
import { useCycleLogic } from "@/hooks/useCycleLogic";
import { Legend } from "./Legend";
import { SystemControls } from "../SystemControls";
import type { ViewMode } from "@/lib/calendar/types";

const YearTimeline = lazy(() => import("./YearTimeline").then(mod => ({ default: mod.YearTimeline })));
const MonthGrid = lazy(() => import("./MonthGrid").then(mod => ({ default: mod.MonthGrid })));
const AgendaList = lazy(() => import("./AgendaList").then(mod => ({ default: mod.AgendaList })));

export interface CalendarViewProps {
  year?: number;
  cycleStartDate?: Date;
  workWeeks?: number;
  restWeeks?: number;
  weekStartsOn?: 0 | 1;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

/**
 * Main calendar container with view switching and filtering controls.
 * Lazy-loads view components for optimal bundle size.
 */
export function CalendarView({
  year = new Date().getFullYear(),
  cycleStartDate = new Date(year, 0, 1),
  workWeeks = 6,
  restWeeks = 1,
  weekStartsOn = 1,
  isDarkMode = true,
  onToggleDarkMode = () => {},
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");
  const tApp = useTranslations('app');
  const tViewModes = useTranslations('viewModes');
  const tHome = useTranslations('home');

  const {
    blocks,
    filteredBlocks,
    totalCycles,
    currentBlock,
    filterOptions,
    setFilterOptions,
    getBlockForDate,
  } = useCycleLogic({
    year,
    cycleStartDate,
    workWeeks,
    restWeeks,
    weekStartsOn,
  });

  const VIEW_MODES = [
    { value: "timeline" as const, label: tViewModes('timeline'), icon: "M4 6h16M4 12h16M4 18h16" },
    { value: "month" as const, label: tViewModes('month'), icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { value: "agenda" as const, label: tViewModes('agenda'), icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 sm:p-2 md:p-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
        {/* System Controls - Language & Dark Mode */}
        <SystemControls isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />

        {/* Header */}
        <m.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4 sm:px-2 pt-2 sm:pt-0"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-work-600 to-rest-600">
            {tApp('title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-sm md:text-base leading-relaxed sm:leading-normal">
            {year} — {tApp('subtitle')}
          </p>
        </m.div>

        {/* View mode selector */}
        <m.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="inline-flex bg-white dark:bg-gray-900 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-800 gap-2 sm:gap-1">
            {VIEW_MODES.map((mode) => (
              <m.button
                key={mode.value}
                onClick={() => setViewMode(mode.value)}
                className={`
                  flex items-center gap-2 sm:gap-2 px-4 py-3 sm:px-3 sm:py-2 rounded-lg text-sm sm:text-sm font-medium
                  transition-colors duration-200
                  ${
                    viewMode === mode.value
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  className="w-5 h-5 sm:w-4 sm:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={mode.icon}
                  />
                </svg>
                <span className="inline sm:hidden">{mode.label}</span>
                <span className="hidden sm:inline">{mode.label}</span>
              </m.button>
            ))}
          </div>
        </m.div>

        {/* Main content area */}
        <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px] gap-3 sm:gap-4">
          {/* Calendar views */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-2 sm:p-3 md:p-4 shadow-lg border border-gray-200 dark:border-gray-800 min-h-[500px] lg:min-h-[700px] overflow-x-hidden">
            <Suspense fallback={
              <div className="flex items-center justify-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-work-500"></div>
              </div>
            }>
              <AnimatePresence mode="wait">
                {viewMode === "timeline" && (
                  <m.div
                    key="timeline"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <YearTimeline
                      blocks={filteredBlocks}
                      currentBlock={currentBlock}
                    />
                  </m.div>
                )}

                {viewMode === "month" && (
                  <m.div
                    key="month"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MonthGrid
                      blocks={blocks}
                      year={year}
                      getBlockForDate={getBlockForDate}
                    />
                  </m.div>
                )}

                {viewMode === "agenda" && (
                  <m.div
                    key="agenda"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AgendaList
                      blocks={blocks}
                      currentBlock={currentBlock}
                    />
                  </m.div>
                )}
              </AnimatePresence>
            </Suspense>
          </div>

          {/* Sidebar - Legend and filters */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Legend
              totalCycles={totalCycles}
              currentCycleNumber={currentBlock?.cycleNumber}
              filterOptions={filterOptions}
              onFilterChange={setFilterOptions}
            />
          </div>
        </div>

        {/* Footer info */}
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            {tHome('footer')}
          </p>
        </m.div>
      </div>
    </div>
  );
}

