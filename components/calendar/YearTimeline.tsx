"use client";

import { motion } from "motion/react";
import { format, isSameWeek, startOfMonth, isSameMonth } from "date-fns";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { Block, MonthRange, CycleLabels } from "@/lib/calendar/types";
import { DIMENSIONS, ANIMATION_CONFIG, DATE_FORMATS, TEXT, CYCLE_CONFIG } from "@/lib/calendar/constants";

interface YearTimelineProps {
  blocks: Block[];
  currentBlock?: Block;
}

/**
 * YearTimeline component displays a horizontal scrollable timeline of all weeks in the year.
 * Features include:
 * - Month indicators showing which months contain which weeks
 * - Visual distinction between work and rest weeks
 * - Cycle end markers with editable labels
 * - Current week highlighting
 * - Hover tooltips with week details
 * 
 * @param props - Component props
 * @param props.blocks - Array of calendar blocks to display
 * @param props.currentBlock - The block containing today's date (if any)
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

  const monthRanges = useMemo((): MonthRange[] => {
    const monthBlocks: MonthRange[] = [];
    let currentMonth = startOfMonth(blocks[0].start);
    let startIndex = 0;
    let count = 0;

    blocks.forEach((block, index) => {
      if (!isSameMonth(block.start, currentMonth)) {
        monthBlocks.push({
          month: format(currentMonth, DATE_FORMATS.MONTH_YEAR),
          startIndex,
          width: count,
        });
        currentMonth = startOfMonth(block.start);
        startIndex = index;
        count = 1;
      } else {
        count++;
      }
    });

    if (count > 0) {
      monthBlocks.push({
        month: format(currentMonth, DATE_FORMATS.MONTH_YEAR),
        startIndex,
        width: count,
      });
    }

    return monthBlocks;
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
    <div className="w-full overflow-x-auto pb-4">
      {/* Month indicators */}
      <div className="min-w-max flex gap-1 px-4 mb-2">
        {monthRanges.map((monthRange, monthIndex) => (
          <div
            key={monthIndex}
            style={{
              width: `${monthRange.width * DIMENSIONS.WEEK_BLOCK_WITH_GAP}px`,
              marginLeft: monthIndex === 0 ? 0 : undefined,
            }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: monthIndex * ANIMATION_CONFIG.DELAY_MONTH_STAGGER }}
              className="text-xs font-semibold text-gray-700 dark:text-gray-300 py-2 px-2 bg-gray-100 dark:bg-gray-800 rounded-md"
            >
              {monthRange.month}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Week blocks */}
      <div className="min-w-max flex gap-1 p-4 pt-2 relative">
        {blocks.map((block, index) => {
          const isCurrentWeek = currentBlock && isSameWeek(block.start, currentBlock.start);
          const weekLabel = format(block.start, DATE_FORMATS.MONTH_SHORT);
          const isLastWeekOfCycle = block.weekInCycle === CYCLE_CONFIG.TOTAL_WEEKS_IN_CYCLE;
          
          return (
            <div key={`${block.cycleNumber}-${block.weekInCycle}-${index}`} className="relative">
              <motion.div
                initial={{ opacity: 0, scale: ANIMATION_CONFIG.SCALE_INITIAL }}
                animate={{ opacity: 1, scale: ANIMATION_CONFIG.SCALE_NORMAL }}
                transition={{
                  duration: ANIMATION_CONFIG.DURATION_NORMAL,
                  delay: index * ANIMATION_CONFIG.DELAY_STAGGER,
                  ease: ANIMATION_CONFIG.EASING_EXPO,
                }}
                whileHover={{
                  scale: ANIMATION_CONFIG.SCALE_HOVER,
                  y: -4,
                  transition: { duration: ANIMATION_CONFIG.DURATION_FAST },
                }}
                className="relative group"
              >
                <div
                  className={`
                    rounded-lg transition-all duration-300 cursor-pointer
                    ${
                      block.type === "work"
                        ? "bg-work-400 dark:bg-work-600"
                        : "bg-rest-400 dark:bg-rest-600"
                    }
                    ${isCurrentWeek ? "ring-4 ring-gray-900 dark:ring-white shadow-xl" : "shadow-md"}
                  `}
                  style={{
                    width: `${DIMENSIONS.WEEK_BLOCK_WIDTH}px`,
                    height: `${DIMENSIONS.WEEK_BLOCK_HEIGHT}px`,
                  }}
                >
                  {/* Week indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-xs font-medium">
                    <span className="text-[10px] opacity-75">W{block.weekInCycle}</span>
                    <span className="text-[9px] opacity-60 mt-1">C{block.cycleNumber}</span>
                  </div>

                  {/* Current week indicator */}
                  {isCurrentWeek && (
                    <motion.div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: ANIMATION_CONFIG.CURRENT_WEEK_SCALE }}
                      transition={{ duration: ANIMATION_CONFIG.DURATION_SLOW, delay: ANIMATION_CONFIG.DELAY_SHORT }}
                    />
                  )}
                </div>

                {/* Hover tooltip */}
                <motion.div
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  initial={false}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{weekLabel}</span>
                    <span className="text-[10px] opacity-75 capitalize">
                      {block.type} Week
                    </span>
                  </div>
                  {/* Arrow */}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white rotate-45" />
                </motion.div>

                {/* Cycle separator */}
                {block.weekInCycle === 1 && block.cycleNumber > 1 && (
                  <div className="absolute -left-2 top-0 bottom-0 w-[2px] bg-gray-300 dark:bg-gray-700" />
                )}
              </motion.div>

              {/* Cycle end marker with editable label */}
              {isLastWeekOfCycle && (
                <motion.div
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: index * ANIMATION_CONFIG.DELAY_STAGGER + ANIMATION_CONFIG.DELAY_NORMAL, duration: 0.4 }}
                  className="absolute -right-2 top-0 flex flex-col items-center"
                  style={{ transformOrigin: "top" }}
                >
                  <div 
                    className="bg-gradient-to-b from-gray-600 to-gray-400 dark:from-gray-400 dark:to-gray-600 rounded-full shadow-lg"
                    style={{
                      width: `${DIMENSIONS.CYCLE_MARKER_WIDTH}px`,
                      height: `${DIMENSIONS.CYCLE_MARKER_HEIGHT}px`,
                    }}
                  />
                  
                  <div 
                    className="bg-gray-600 dark:bg-gray-400 rounded-full shadow-md -mt-1"
                    style={{
                      width: `${DIMENSIONS.CYCLE_MARKER_DOT_SIZE}px`,
                      height: `${DIMENSIONS.CYCLE_MARKER_DOT_SIZE}px`,
                    }}
                  />
                  
                  {/* Editable label */}
                  <div className="mt-2 flex flex-col items-center">
                    {editingCycle === block.cycleNumber ? (
                      <input
                        ref={inputRef}
                        type="text"
                        defaultValue={cycleLabels[block.cycleNumber] || ""}
                        placeholder="Label..."
                        onBlur={(event) => handleLabelSave(block.cycleNumber, event.target.value)}
                        onKeyDown={(event) => handleKeyDown(event, block.cycleNumber)}
                        className="px-2 py-1 text-xs text-center bg-white dark:bg-gray-800 border-2 border-work-500 dark:border-work-400 rounded-md focus:outline-none focus:ring-2 focus:ring-work-500 dark:focus:ring-work-400 text-gray-900 dark:text-white"
                        style={{ width: `${DIMENSIONS.LABEL_WIDTH}px` }}
                      />
                    ) : (
                      <motion.button
                        onClick={() => handleLabelClick(block.cycleNumber)}
                        whileHover={{ scale: ANIMATION_CONFIG.SCALE_HOVER }}
                        whileTap={{ scale: ANIMATION_CONFIG.SCALE_TAP }}
                        className="px-2 py-1 text-xs text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors cursor-pointer text-gray-700 dark:text-gray-300 font-medium border border-gray-300 dark:border-gray-600"
                        style={{ width: `${DIMENSIONS.LABEL_WIDTH}px` }}
                      >
                        {cycleLabels[block.cycleNumber] || TEXT.CYCLE_LABEL_PLACEHOLDER}
                      </motion.button>
                    )}
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Cycle {block.cycleNumber}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      <motion.div
        className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: ANIMATION_CONFIG.DELAY_LONG }}
      >
        {TEXT.SCROLL_INDICATOR}
      </motion.div>
    </div>
  );
}

