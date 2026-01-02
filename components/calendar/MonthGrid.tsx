"use client";

import { motion, AnimatePresence } from "motion/react";
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
import { useState } from "react";
import type { Block } from "@/lib/calendar/types";

interface MonthGridProps {
  blocks: Block[];
  year: number;
  getBlockForDate: (date: Date) => Block | undefined;
}

export function MonthGrid({ blocks, year, getBlockForDate }: MonthGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(year, 0, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Check if we're at the boundaries of the year
  const isFirstMonth = currentMonth.getMonth() === 0 && currentMonth.getFullYear() === year;
  const isLastMonth = currentMonth.getMonth() === 11 && currentMonth.getFullYear() === year;

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = subMonths(prev, 1);
      // Don't allow going before January of the target year
      if (newMonth.getFullYear() < year || (newMonth.getFullYear() === year && newMonth.getMonth() < 0)) {
        return prev;
      }
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      const newMonth = addMonths(prev, 1);
      // Don't allow going after December of the target year
      if (newMonth.getFullYear() > year || (newMonth.getFullYear() === year && newMonth.getMonth() > 11)) {
        return prev;
      }
      return newMonth;
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={handlePrevMonth}
          disabled={isFirstMonth}
          className={`
            p-2 rounded-lg transition-colors
            ${isFirstMonth 
              ? "opacity-30 cursor-not-allowed" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"}
          `}
          whileHover={isFirstMonth ? {} : { scale: 1.05 }}
          whileTap={isFirstMonth ? {} : { scale: 0.95 }}
        >
          <svg
            className="w-6 h-6"
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
        </motion.button>

        <motion.h2
          key={format(currentMonth, "MMMM yyyy")}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-2xl font-bold"
        >
          {format(currentMonth, "MMMM yyyy")}
        </motion.h2>

        <motion.button
          onClick={handleNextMonth}
          disabled={isLastMonth}
          className={`
            p-2 rounded-lg transition-colors
            ${isLastMonth 
              ? "opacity-30 cursor-not-allowed" 
              : "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"}
          `}
          whileHover={isLastMonth ? {} : { scale: 1.05 }}
          whileTap={isLastMonth ? {} : { scale: 0.95 }}
        >
          <svg
            className="w-6 h-6"
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
        </motion.button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-7 gap-2"
        >
          {days.map((day, index) => {
            const block = getBlockForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isTodayDate = isToday(day);

            return (
              <motion.div
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.01,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`
                  relative aspect-square rounded-lg p-2 cursor-pointer
                  transition-all duration-200
                  ${!isCurrentMonth ? "opacity-30" : ""}
                  ${
                    block?.type === "work"
                      ? "bg-work-100 dark:bg-work-900 hover:bg-work-200 dark:hover:bg-work-800"
                      : block?.type === "rest"
                      ? "bg-rest-100 dark:bg-rest-900 hover:bg-rest-200 dark:hover:bg-rest-800"
                      : "bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                  ${isTodayDate ? "ring-2 ring-gray-900 dark:ring-white" : ""}
                `}
              >
                <span
                  className={`
                    text-sm font-medium
                    ${isTodayDate ? "text-gray-900 dark:text-white font-bold" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>

                {/* Block type indicator */}
                {block && isCurrentMonth && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    <div
                      className={`
                        w-1 h-1 rounded-full
                        ${
                          block.type === "work"
                            ? "bg-work-500 dark:bg-work-400"
                            : "bg-rest-500 dark:bg-rest-400"
                        }
                      `}
                    />
                  </div>
                )}

                {/* Today indicator */}
                {isTodayDate && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-gray-900 dark:bg-white rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

