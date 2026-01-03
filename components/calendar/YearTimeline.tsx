"use client";

import { m } from "motion/react";
import { isSameWeek, getMonth, getYear } from "date-fns";
import { useState, useMemo, useRef, useEffect } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { formatFullDate, formatDate, type Locale } from "@/lib/i18n/dateFormats";
import { useCycleNaming } from "@/lib/context/CycleNamingContext";
import type { Block } from "@/lib/calendar/types";

interface YearTimelineProps {
  blocks: Block[];
  currentBlock?: Block;
}

interface CycleData {
  cycleNumber: number;
  weeks: Block[];
}

/**
 * Vertical timeline view with month indicators and editable cycle names.
 * User-defined cycle names are stored globally and propagate to all components.
 */
export function YearTimeline({ blocks, currentBlock }: YearTimelineProps) {
  const [editingCycle, setEditingCycle] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [showNamingHint, setShowNamingHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cycleRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const { getCycleName, setCycleName } = useCycleNaming();
  const t = useTranslations('timeline');
  const tCalendar = useTranslations('calendar');
  const tMonths = useTranslations('months');
  const locale = useLocale() as Locale;

  // Check if user has seen hint (all screen sizes)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMobile(window.innerWidth < 640);
      const hasSeenHint = localStorage.getItem('hasSeenCycleNamingHint');
      if (!hasSeenHint) {
        setShowNamingHint(true);
      }
    }
  }, []);

  // Month names from translations (no emojis)
  const MONTHS = useMemo(() => [
    tMonths('january'),
    tMonths('february'),
    tMonths('march'),
    tMonths('april'),
    tMonths('may'),
    tMonths('june'),
    tMonths('july'),
    tMonths('august'),
    tMonths('september'),
    tMonths('october'),
    tMonths('november'),
    tMonths('december'),
  ], [tMonths]);

  // Group blocks into cycles
  const cycles = useMemo((): CycleData[] => {
    const cycleMap = new Map<number, Block[]>();
    
    blocks.forEach((block) => {
      const cycleBlocks = cycleMap.get(block.cycleNumber) || [];
      cycleBlocks.push(block);
      cycleMap.set(block.cycleNumber, cycleBlocks);
    });

    return Array.from(cycleMap.entries()).map(([cycleNumber, weeks]) => ({
      cycleNumber,
      weeks,
    }));
  }, [blocks]);

  // Map months (0-11) to cycle numbers that contain them
  // For months with multiple cycles, prefer the cycle that starts in that month
  const monthToCycleMap = useMemo(() => {
    const map = new Map<number, number>();
    const monthWeekCounts = new Map<number, Map<number, number>>(); // month -> cycle -> week count
    
    cycles.forEach((cycle) => {
      cycle.weeks.forEach((week) => {
        const month = getMonth(week.start);
        if (!monthWeekCounts.has(month)) {
          monthWeekCounts.set(month, new Map());
        }
        const cycleCounts = monthWeekCounts.get(month)!;
        cycleCounts.set(cycle.cycleNumber, (cycleCounts.get(cycle.cycleNumber) || 0) + 1);
      });
    });

    // For each month, choose the cycle with most weeks, or the one that starts in that month
    monthWeekCounts.forEach((cycleCounts, month) => {
      let bestCycle = -1;
      let maxWeeks = 0;
      const startCycle = cycles.find(c => getMonth(c.weeks[0].start) === month)?.cycleNumber;
      
      cycleCounts.forEach((weeks, cycleNum) => {
        if (weeks > maxWeeks || (weeks === maxWeeks && cycleNum === startCycle)) {
          maxWeeks = weeks;
          bestCycle = cycleNum;
        }
      });
      
      if (bestCycle !== -1) {
        map.set(month, bestCycle);
      }
    });
    
    return map;
  }, [cycles]);

  // Handle month click - scroll to corresponding cycle
  const handleMonthClick = (monthIndex: number) => {
    const cycleNumber = monthToCycleMap.get(monthIndex);
    if (cycleNumber) {
      const cycleElement = cycleRefs.current.get(cycleNumber);
      if (cycleElement) {
        cycleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a brief highlight effect
        cycleElement.classList.add('ring-2', 'ring-work-500', 'ring-offset-2');
        setTimeout(() => {
          cycleElement.classList.remove('ring-2', 'ring-work-500', 'ring-offset-2');
        }, 1000);
      }
    }
  };

  const handleCycleNameClick = (cycleNumber: number) => {
    const currentName = getCycleName(cycleNumber) || "";
    setEditValue(currentName);
    setEditingCycle(cycleNumber);
  };

  const handleCycleNameSave = (cycleNumber: number) => {
    if (editValue.trim()) {
      setCycleName(cycleNumber, editValue.trim());
    }
    setEditingCycle(null);
    setEditValue("");
  };

  const handleKeyDown = (event: React.KeyboardEvent, cycleNumber: number) => {
    if (event.key === "Enter") {
      handleCycleNameSave(cycleNumber);
    } else if (event.key === "Escape") {
      setEditingCycle(null);
      setEditValue("");
    }
  };

  const handleDismissHint = () => {
    setShowNamingHint(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenCycleNamingHint', 'true');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden">
      <div className="flex gap-2 sm:gap-6 md:gap-8 min-h-[800px] relative px-1 sm:px-4 max-w-full">
        {/* Left side - Months (no emojis, cleaner design) */}
        <div className="flex-shrink-0 w-16 sm:w-24 border-r border-gray-200 dark:border-gray-700">
          <div className="sticky top-0 space-y-2 pr-3">
            {MONTHS.map((month, index) => {
              const hasCycle = monthToCycleMap.has(index);
              return (
                <m.div
                  key={month}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => hasCycle && handleMonthClick(index)}
                  onMouseEnter={() => hasCycle && setHoveredMonth(index)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className={`
                    h-12 flex flex-col justify-center py-2 rounded transition-colors
                    ${hasCycle 
                      ? 'cursor-pointer hover:bg-work-50 dark:hover:bg-work-950/30 hover:border-l-2 hover:border-work-500 dark:hover:border-work-400' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}
                  `}
                >
                  <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                    {month}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-500">
                    2026
                  </span>
                </m.div>
              );
            })}
          </div>
        </div>

        {/* Right side - Cycles */}
        <div className="flex-1 relative min-w-0" style={{ minHeight: "800px" }}>
          {/* Timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" />

          {/* Cycles with increased spacing */}
          <div className="ml-4 sm:ml-8 space-y-8 sm:space-y-6">
            {/* Cycle Naming Onboarding Hint - Positioned at top */}
            {showNamingHint && cycles.length > 0 && (
              <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-2 bg-work-50 dark:bg-work-950/30 border border-work-200 dark:border-work-800 rounded-lg p-4 flex items-start gap-3"
              >
                <div className="flex-shrink-0 text-2xl">💡</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {t('cycleNamingHintMobile')}
                  </p>
                  <button
                    onClick={handleDismissHint}
                    className="text-xs text-work-600 dark:text-work-400 font-medium hover:underline"
                  >
                    {t('gotIt')}
                  </button>
                </div>
              </m.div>
            )}

            {cycles.map((cycle, cycleIndex) => {
              const isCurrentCycle = cycle.weeks.some(week => 
                currentBlock && isSameWeek(week.start, currentBlock.start)
              );
              const restWeek = cycle.weeks.find(w => w.type === "rest");
              const cycleName = getCycleName(cycle.cycleNumber);
              const isEditing = editingCycle === cycle.cycleNumber;

              const isHovered = Array.from(monthToCycleMap.entries())
                .some(([month, cycleNum]) => cycleNum === cycle.cycleNumber && hoveredMonth === month);

              return (
                <m.div
                  key={cycle.cycleNumber}
                  ref={(el) => {
                    if (el) {
                      cycleRefs.current.set(cycle.cycleNumber, el);
                    } else {
                      cycleRefs.current.delete(cycle.cycleNumber);
                    }
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: cycleIndex * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  {/* Start marker on timeline */}
                  <m.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: cycleIndex * 0.1 + 0.2, type: "spring" }}
                    className="absolute -left-[27px] top-4"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-work-500 dark:bg-work-400 border-2 border-white dark:border-gray-900 shadow" />
                  </m.div>

                  {/* Cycle Card - cleaner, less dense */}
                  <m.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: cycleIndex * 0.1 + 0.1, duration: 0.5 }}
                    className={`
                      w-full max-w-full sm:w-[420px] md:w-[480px] rounded-xl bg-white dark:bg-gray-900 border 
                      ${isCurrentCycle 
                        ? "border-work-500 dark:border-work-400 shadow-md" 
                        : isHovered
                        ? "border-work-400 dark:border-work-500 shadow-lg bg-work-50/50 dark:bg-work-950/20"
                        : "border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md"}
                      ${cycleIndex === 0 && showNamingHint ? "ring-2 ring-work-400 dark:ring-work-500 ring-offset-2" : ""}
                      p-4 sm:p-4 md:p-5 transition-all duration-200
                    `}
                    style={{ transformOrigin: "top" }}
                  >
                    {/* Header with editable cycle name */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 mr-2 sm:mr-3 min-w-0">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => handleCycleNameSave(cycle.cycleNumber)}
                              onKeyDown={(e) => handleKeyDown(e, cycle.cycleNumber)}
                              placeholder={t('cyclePlaceholder')}
                              autoFocus
                              className="w-full text-lg sm:text-lg font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-2 border-work-500 dark:border-work-400 rounded-lg px-4 py-3 sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-work-400 dark:focus:ring-work-500 focus:border-transparent"
                            />
                          ) : (
                            <button
                              onClick={() => handleCycleNameClick(cycle.cycleNumber)}
                              className="group w-full text-left min-w-0"
                              title={t('clickToEditCycleName')}
                            >
                              <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                                  {cycleName || `${tCalendar('cycle')} ${cycle.cycleNumber}`}
                                </span>
                                {/* Subtle edit indicator - only shown for default (unedited) cycle names */}
                                {!cycleName && (
                                  <svg
                                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500 opacity-60 flex-shrink-0 ml-0.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                )}
                                {/* Hover edit icon - shown on hover for all cycles */}
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </div>
                            </button>
                          )}
                          <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {cycle.weeks.length} {tCalendar('weeks')}
                          </div>
                        </div>
                        {isCurrentCycle && (
                          <div className="px-2 py-0.5 bg-work-500 dark:bg-work-600 text-white text-[10px] font-bold rounded-full whitespace-nowrap">
                            {t('current')}
                          </div>
                        )}
                      </div>

                      {/* Date Range */}
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-between">
                          <span>{t('start')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatFullDate(cycle.weeks[0].start, locale, true)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{t('end')}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatFullDate(new Date(cycle.weeks[cycle.weeks.length - 1].end.getTime() - 1), locale, true)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress bar - simplified */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-work-400 dark:bg-work-600 rounded-full" />
                        <span className="text-[10px] text-gray-600 dark:text-gray-400">{t('workAbbrev')}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-rest-400 dark:bg-rest-600 rounded-full" />
                        <span className="text-[10px] text-gray-600 dark:text-gray-400">{t('restAbbrev')}</span>
                      </div>
                    </div>

                    {/* Rest Week Badge (no emoji) */}
                    {restWeek && (
                      <m.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: cycleIndex * 0.1 + 0.4 }}
                        className="bg-rest-100 dark:bg-rest-900/30 border border-rest-300 dark:border-rest-700 rounded-lg p-2.5 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-[10px] sm:text-xs font-semibold text-rest-700 dark:text-rest-400">
                            {t('restWeek')}
                          </div>
                          <div className="text-[10px] text-rest-600 dark:text-rest-500 mt-0.5">
                            {formatDate(restWeek.start, locale === 'tr' ? 'd MMM' : 'MMM d', locale)} - {formatDate(new Date(restWeek.end.getTime() - 1), locale === 'tr' ? 'd MMM' : 'MMM d', locale)}
                          </div>
                        </div>
                      </m.div>
                    )}
                  </m.div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
