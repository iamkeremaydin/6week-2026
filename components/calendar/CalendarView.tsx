"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, lazy, Suspense } from "react";
import { useCycleLogic } from "@/hooks/useCycleLogic";
import { Legend } from "./Legend";
import type { ViewMode } from "@/lib/calendar/types";

const YearTimeline = lazy(() => import("./YearTimeline").then(mod => ({ default: mod.YearTimeline })));
const MonthGrid = lazy(() => import("./MonthGrid").then(mod => ({ default: mod.MonthGrid })));
const AgendaList = lazy(() => import("./AgendaList").then(mod => ({ default: mod.AgendaList })));

const VIEW_MODES = [
  { value: "timeline" as const, label: "Timeline", icon: "M4 6h16M4 12h16M4 18h16" },
  { value: "month" as const, label: "Month", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { value: "agenda" as const, label: "Agenda", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
] as const;

export interface CalendarViewProps {
  year?: number;
  cycleStartDate?: Date;
  workWeeks?: number;
  restWeeks?: number;
  weekStartsOn?: 0 | 1;
}

export function CalendarView({
  year = new Date().getFullYear(),
  cycleStartDate = new Date(year, 0, 1),
  workWeeks = 6,
  restWeeks = 1,
  weekStartsOn = 1,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("timeline");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-work-600 to-rest-600">
            6+1 Week Cycle Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {year} — Visualize your work and rest cycles
          </p>
        </motion.div>

        {/* View mode selector */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center"
        >
          <div className="inline-flex bg-white dark:bg-gray-900 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-800">
            {VIEW_MODES.map((mode) => (
              <motion.button
                key={mode.value}
                onClick={() => setViewMode(mode.value)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
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
                  className="w-5 h-5"
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
                <span className="hidden sm:inline">{mode.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main content area */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Calendar views */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 min-h-[600px]">
            <Suspense fallback={
              <div className="flex items-center justify-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-work-500"></div>
              </div>
            }>
              <AnimatePresence mode="wait">
                {viewMode === "timeline" && (
                  <motion.div
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
                  </motion.div>
                )}

                {viewMode === "month" && (
                  <motion.div
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
                  </motion.div>
                )}

                {viewMode === "agenda" && (
                  <motion.div
                    key="agenda"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AgendaList
                      blocks={filteredBlocks}
                      currentBlock={currentBlock}
                    />
                  </motion.div>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <p>
            Built with Next.js, React 19, TypeScript, Tailwind CSS, and Motion
          </p>
        </motion.div>
      </div>
    </div>
  );
}

