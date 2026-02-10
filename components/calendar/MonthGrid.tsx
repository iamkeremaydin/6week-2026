"use client";

import { m, AnimatePresence } from "motion/react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { useState, useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { formatMonthYear, type Locale } from "@/lib/i18n/dateFormats";
import { useCycleNaming } from "@/lib/context/CycleNamingContext";
import type { Block } from "@/lib/calendar/types";

interface MonthGridProps {
  blocks: Block[];
  year: number;
  getBlockForDate: (date: Date) => Block | undefined;
}

/**
 * Traditional month calendar grid with work/rest day highlighting.
 * Navigation is locked to the configured year to prevent viewing incomplete cycle data.
 */
export function MonthGrid({ year, getBlockForDate }: MonthGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const tWeekdays = useTranslations('weekdays');
  const tCalendar = useTranslations('calendar');
  const locale = useLocale() as Locale;
  const { getCycleName } = useCycleNaming();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  // Weekday names from translations
  const weekDays = useMemo(() => [
    tWeekdays('mon'),
    tWeekdays('tue'),
    tWeekdays('wed'),
    tWeekdays('thu'),
    tWeekdays('fri'),
    tWeekdays('sat'),
    tWeekdays('sun'),
  ], [tWeekdays]);

  // Calculate unique cycle numbers present in the current month
  const cyclesInMonth = useMemo(() => {
    const cycleSet = new Set<number>();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    
    // Iterate through all days in the current month
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    monthDays.forEach((day) => {
      const block = getBlockForDate(day);
      if (block?.cycleNumber) {
        cycleSet.add(block.cycleNumber);
      }
    });
    
    // Return sorted array of unique cycle numbers
    return Array.from(cycleSet).sort((a, b) => a - b);
  }, [currentMonth, getBlockForDate]);

  // Navigation is locked to the target year to prevent viewing cycles outside the configured period
  const isFirstMonth = currentMonth.getMonth() === 0 && currentMonth.getFullYear() === year;
  const isLastMonth = currentMonth.getMonth() === 11 && currentMonth.getFullYear() === year;

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = subMonths(prev, 1);
      if (newMonth.getFullYear() < year || (newMonth.getFullYear() === year && newMonth.getMonth() < 0)) {
        return prev;
      }
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = addMonths(prev, 1);
      if (newMonth.getFullYear() > year || (newMonth.getFullYear() === year && newMonth.getMonth() > 11)) {
        return prev;
      }
      return newMonth;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-0">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <m.button
          onClick={handlePrevMonth}
          disabled={isFirstMonth}
          className={`
            p-3 sm:p-2 rounded-lg transition-colors
            ${isFirstMonth 
              ? "opacity-30 cursor-not-allowed" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"}
          `}
          whileHover={isFirstMonth ? {} : { scale: 1.05 }}
          whileTap={isFirstMonth ? {} : { scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </m.button>

        <m.h2
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-bold"
        >
          {formatMonthYear(currentMonth, locale)}
        </m.h2>

        <m.button
          onClick={handleNextMonth}
          disabled={isLastMonth}
          className={`
            p-3 sm:p-2 rounded-lg transition-colors
            ${isLastMonth 
              ? "opacity-30 cursor-not-allowed" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"}
          `}
          whileHover={isLastMonth ? {} : { scale: 1.05 }}
          whileTap={isLastMonth ? {} : { scale: 0.95 }}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </m.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 py-1 sm:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <m.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-7 gap-1 sm:gap-2"
        >
          {days.map((day, index) => {
            // Always get block for the day, regardless of which month it's in
            const block = getBlockForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);
            const cycleName = block?.cycleNumber ? getCycleName(block.cycleNumber) : undefined;
            const displayCycleName = cycleName || (block?.cycleNumber ? `${tCalendar('cycle')} ${block.cycleNumber}` : undefined);

            return (
              <m.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.01,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`
                  relative aspect-square rounded-lg p-1.5 sm:p-2 cursor-pointer flex flex-col items-center justify-start
                  transition-all duration-200
                  ${
                    block?.type === "work"
                      ? !isCurrentMonth
                        ? "bg-work-50 dark:bg-work-950 hover:bg-work-100 dark:hover:bg-work-900"
                        : "bg-work-100 dark:bg-work-900 hover:bg-work-200 dark:hover:bg-work-800"
                      : block?.type === "rest"
                      ? !isCurrentMonth
                        ? "bg-rest-50 dark:bg-rest-950 hover:bg-rest-100 dark:hover:bg-rest-900"
                        : "bg-rest-100 dark:bg-rest-900 hover:bg-rest-200 dark:hover:bg-rest-800"
                      : !isCurrentMonth
                      ? "bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
                      : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                  ${isTodayDate ? "ring-2 ring-gray-900 dark:ring-white" : ""}
                `}
              >
                <div className="flex flex-col items-center w-full gap-0.5 sm:gap-1">
                  <span
                    className={`
                      text-xs sm:text-sm font-semibold
                      ${
                        isTodayDate 
                          ? "text-gray-900 dark:text-white font-bold" 
                          : !isCurrentMonth
                          ? "text-gray-500 dark:text-gray-500"
                          : "text-gray-700 dark:text-gray-200"
                      }
                    `}
                  >
                    {format(day, "d")}
                  </span>
                  
                  {/* Cycle name label - show for all days with blocks, regardless of month view */}
                  {block && displayCycleName && (
                    <span
                      className={`
                        text-[9px] sm:text-[10px] font-semibold truncate w-full text-center px-1 py-0.5 rounded
                        ${
                          block.type === "work"
                            ? !isCurrentMonth
                              ? "bg-work-100/60 dark:bg-work-900/40 text-work-600/80 dark:text-work-400/70"
                              : "bg-work-200/80 dark:bg-work-800/60 text-work-700 dark:text-work-300"
                            : !isCurrentMonth
                            ? "bg-rest-100/60 dark:bg-rest-900/40 text-rest-600/80 dark:text-rest-400/70"
                            : "bg-rest-200/80 dark:bg-rest-800/60 text-rest-700 dark:text-rest-300"
                        }
                        ${isTodayDate ? "ring-1 ring-gray-900/20 dark:ring-white/20" : ""}
                      `}
                      title={displayCycleName}
                    >
                      {displayCycleName.length > 10 ? `${displayCycleName.substring(0, 8)}...` : displayCycleName}
                    </span>
                  )}
                </div>

                {/* Block type indicator - only show if no cycle name to avoid clutter, for all days with blocks */}
                {block && !displayCycleName && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    <div
                      className={`
                        w-1.5 h-1.5 rounded-full
                        ${
                          block.type === "work"
                            ? !isCurrentMonth
                              ? "bg-work-400/60 dark:bg-work-500/50"
                              : "bg-work-500 dark:bg-work-400"
                            : !isCurrentMonth
                            ? "bg-rest-400/60 dark:bg-rest-500/50"
                            : "bg-rest-500 dark:bg-rest-400"
                        }
                      `}
                    />
                  </div>
                )}

                {/* Today indicator */}
                {isTodayDate && (
                  <m.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-gray-900 dark:bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </m.div>
            );
          })}
        </m.div>
      </AnimatePresence>

      {/* Cycle names legend */}
      {cyclesInMonth.length > 0 && (
        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
            {tCalendar('cycle')}s in {formatMonthYear(currentMonth, locale)}
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {cyclesInMonth.map((cycleNumber) => {
              const cycleName = getCycleName(cycleNumber);
              const displayName = cycleName || `${tCalendar('cycle')} ${cycleNumber}`;
              
              return (
                <m.div
                  key={cycleNumber}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: cycleNumber * 0.05 }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-work-500 dark:bg-work-400" />
                  <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                    {displayName}
                  </span>
                </m.div>
              );
            })}
          </div>
        </m.div>
      )}
    </div>
  );
}

