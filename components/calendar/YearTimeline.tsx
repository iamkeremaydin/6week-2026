"use client";

import { m } from "motion/react";
import { format, isSameWeek, getDayOfYear } from "date-fns";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { Block, CycleLabels } from "@/lib/calendar/types";

interface YearTimelineProps {
  blocks: Block[];
  currentBlock?: Block;
}

interface CycleData {
  cycleNumber: number;
  weeks: Block[];
  startPosition: number;
  endPosition: number;
  restWeekPosition: number;
}

const MONTHS = [
  { name: "January", icon: "❄️" },
  { name: "February", icon: "💝" },
  { name: "March", icon: "🌸" },
  { name: "April", icon: "🌷" },
  { name: "May", icon: "🌺" },
  { name: "June", icon: "☀️" },
  { name: "July", icon: "🏖️" },
  { name: "August", icon: "🌻" },
  { name: "September", icon: "🍂" },
  { name: "October", icon: "🎃" },
  { name: "November", icon: "🍁" },
  { name: "December", icon: "🎄" },
];

/**
 * Vertical timeline view showing months and cycles with editable labels.
 * Displays month indicators on the left and cycle cards on the right showing work/rest periods.
 */
export function YearTimeline({ blocks, currentBlock }: YearTimelineProps) {
  const [cycleLabels, setCycleLabels] = useState<CycleLabels>({});
  const [editingCycle, setEditingCycle] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingCycle !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCycle]);

  // Group blocks into cycles with their vertical positions
  const cycles = useMemo((): CycleData[] => {
    const cycleMap = new Map<number, Block[]>();
    
    blocks.forEach((block) => {
      const cycleBlocks = cycleMap.get(block.cycleNumber) || [];
      cycleBlocks.push(block);
      cycleMap.set(block.cycleNumber, cycleBlocks);
    });

    return Array.from(cycleMap.entries()).map(([cycleNumber, weeks]) => {
      const firstWeek = weeks[0];
      const lastWeek = weeks[weeks.length - 1];
      const restWeek = weeks.find(w => w.type === "rest");

      const totalDays = 365;

      const startDay = getDayOfYear(firstWeek.start);
      const endDay = getDayOfYear(lastWeek.start) + 7; // +7 days for the week duration
      const restDay = restWeek ? getDayOfYear(restWeek.start) : endDay;

      return {
        cycleNumber,
        weeks,
        startPosition: (startDay / totalDays) * 100,
        endPosition: (endDay / totalDays) * 100,
        restWeekPosition: (restDay / totalDays) * 100,
      };
    });
  }, [blocks]);

  const handleLabelClick = useCallback((cycleNum: number) => {
    setEditingCycle(cycleNum);
  }, []);

  const handleLabelSave = useCallback((cycleNum: number, value: string) => {
    setCycleLabels(prev => ({ ...prev, [cycleNum]: value }));
    setEditingCycle(null);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, cycleNum: number) => {
    if (event.key === "Enter") {
      handleLabelSave(cycleNum, (event.target as HTMLInputElement).value);
    } else if (event.key === "Escape") {
      setEditingCycle(null);
    }
  }, [handleLabelSave]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="flex gap-2 sm:gap-4 md:gap-8 min-h-[800px] relative px-2 sm:px-4">
        {/* Left side - Months */}
        <div className="flex-shrink-0 w-16 sm:w-20 md:w-24 lg:w-32">
          <div className="sticky top-0 space-y-1">
            {MONTHS.map((month, index) => (
              <m.div
                key={month.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="h-16 flex items-center gap-1 sm:gap-2 md:gap-3 px-1 sm:px-2 md:px-3 py-2 rounded-lg bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-850 border border-gray-200 dark:border-gray-700"
              >
                <span className="text-xl sm:text-2xl">{month.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                    {month.name.substring(0, 3)}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:inline">
                    2026
                  </span>
                </div>
              </m.div>
            ))}
          </div>
        </div>

        {/* Right side - Cycles visualization */}
        <div className="flex-1 relative" style={{ minHeight: "800px" }}>
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-work-300 via-work-400 to-work-500 dark:from-work-600 dark:via-work-700 dark:to-work-800 rounded-full" />

          {/* Cycles - using static positioning instead of absolute */}
          <div className="ml-4 sm:ml-6 md:ml-8 space-y-4">
            {cycles.map((cycle, cycleIndex) => {
              const isCurrentCycle = cycle.weeks.some(week => 
                currentBlock && isSameWeek(week.start, currentBlock.start)
              );
              const restWeek = cycle.weeks.find(w => w.type === "rest");

              return (
                <m.div
                  key={cycle.cycleNumber}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: cycleIndex * 0.1, duration: 0.5 }}
                  className="relative flex flex-col sm:flex-row gap-2 sm:gap-3"
                >
                  {/* Start marker */}
                  <m.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: cycleIndex * 0.1 + 0.2, type: "spring" }}
                    className="absolute -left-[34px] top-0"
                  >
                    <div className="w-3 h-3 rounded-full bg-work-500 dark:bg-work-400 border-4 border-white dark:border-gray-900 shadow-lg" />
                  </m.div>

                  {/* Compact Cycle Card */}
                  <m.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: cycleIndex * 0.1 + 0.1, duration: 0.5 }}
                    className={`
                      w-full sm:w-[480px] md:w-[560px] rounded-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border-2 
                      ${isCurrentCycle 
                        ? "border-work-500 dark:border-work-400 shadow-2xl" 
                        : "border-gray-200 dark:border-gray-700 shadow-lg"}
                      p-3 sm:p-4
                    `}
                    style={{ transformOrigin: "top" }}
                  >
                    {/* Cycle Header */}
                    <div>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-work-500 to-work-600 dark:from-work-600 dark:to-work-700 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md">
                            C{cycle.cycleNumber}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              Cycle {cycle.cycleNumber}
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                              {cycle.weeks.length} weeks
                            </div>
                          </div>
                        </div>
                        {isCurrentCycle && (
                          <div className="px-2 py-1 bg-work-500 dark:bg-work-600 text-white text-[10px] font-bold rounded-full">
                            CURRENT
                          </div>
                        )}
                      </div>

                      {/* Date Range */}
                      <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                          <span className="text-gray-500 dark:text-gray-400">Start:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {format(cycle.weeks[0].start, "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                          <span className="text-gray-500 dark:text-gray-400">End:</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {format(cycle.weeks[cycle.weeks.length - 1].start, "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>

                      {/* Work/Rest Indicator */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-1">
                          <div className="flex-1 h-2 bg-work-400 dark:bg-work-600 rounded-full" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-400">6W</span>
                        </div>
                        <div className="flex-1 flex items-center gap-1">
                          <div className="flex-1 h-2 bg-rest-400 dark:bg-rest-600 rounded-full" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-400">1R</span>
                        </div>
                      </div>
                    </div>

                    {/* Rest Week Badge */}
                    {restWeek && (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: cycleIndex * 0.1 + 0.4 }}
                        className="mt-2 sm:mt-3 bg-gradient-to-r from-rest-400 to-rest-500 dark:from-rest-600 dark:to-rest-700 rounded-lg p-2 flex items-center gap-2"
                      >
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/30 rounded-full flex items-center justify-center text-base sm:text-lg">
                          🏖️
                        </div>
                        <div className="flex-1">
                          <div className="text-[10px] sm:text-xs font-bold text-white">Rest Week</div>
                          <div className="text-[9px] sm:text-[10px] text-white/80">
                            {format(restWeek.start, "MMM d")} - {format(new Date(restWeek.start.getTime() + 6 * 24 * 60 * 60 * 1000), "MMM d")}
                          </div>
                        </div>
                      </m.div>
                    )}
                  </m.div>

                  {/* Editable label - hidden on mobile, visible on sm and up */}
                  <div className="hidden sm:flex items-center">
                    {editingCycle === cycle.cycleNumber ? (
                      <input
                        ref={inputRef}
                        type="text"
                        defaultValue={cycleLabels[cycle.cycleNumber] || ""}
                        placeholder="Label..."
                        onBlur={(event) => handleLabelSave(cycle.cycleNumber, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(event, cycle.cycleNumber)}
                        className="w-24 sm:w-32 px-2 py-1 text-xs bg-white dark:bg-gray-800 border-2 border-work-500 dark:border-work-400 rounded-md focus:outline-none focus:ring-2 focus:ring-work-500 dark:focus:ring-work-400 text-gray-900 dark:text-white shadow-lg"
                      />
                    ) : (
                      <m.button
                        onClick={() => handleLabelClick(cycle.cycleNumber)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-24 sm:w-32 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600 shadow-md truncate"
                      >
                        {cycleLabels[cycle.cycleNumber] || "Add label"}
                      </m.button>
                    )}
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
