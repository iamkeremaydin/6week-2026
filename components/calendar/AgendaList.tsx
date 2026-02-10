"use client";

import { m, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useMemo } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { formatFullDateWithWeekday, formatDateRange, type Locale } from "@/lib/i18n/dateFormats";
import { useCycleNaming } from "@/lib/context/CycleNamingContext";
import type { Block } from "@/lib/calendar/types";

interface AgendaListProps {
  blocks: Block[];
  currentBlock?: Block;
}

function AgendaItem({
  block,
  index,
  isCurrentWeek,
  isPastWeek,
  strikethroughEnabled,
}: {
  block: Block;
  index: number;
  isCurrentWeek: boolean;
  isPastWeek: boolean;
  strikethroughEnabled: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const t = useTranslations('agenda');
  const tCalendar = useTranslations('calendar');
  const locale = useLocale() as Locale;
  const { getCycleName } = useCycleNaming();

  const weekRange = formatDateRange(
    block.start,
    new Date(block.end.getTime() - 1),
    locale
  );

  const cycleName = getCycleName(block.cycleNumber);

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.19, 1, 0.22, 1],
      }}
      className={`
        relative overflow-hidden rounded-xl transition-all duration-300
        ${isCurrentWeek ? "ring-2 ring-gray-900 dark:ring-white" : ""}
        ${isPastWeek ? "opacity-60" : ""}
      `}
    >
      <m.div
        className={`
          p-5 sm:p-4 md:p-6 cursor-pointer
          ${
            block.type === "work"
              ? "bg-work-50 dark:bg-work-950 hover:bg-work-100 dark:hover:bg-work-900"
              : "bg-rest-50 dark:bg-rest-950 hover:bg-rest-100 dark:hover:bg-rest-900"
          }
          transition-colors duration-200
        `}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              {/* Type badge */}
              <m.span
                className={`
                  px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide
                  ${
                    block.type === "work"
                      ? "bg-work-500 text-white"
                      : "bg-rest-500 text-white"
                  }
                `}
                whileHover={{ scale: 1.05 }}
              >
                {t(block.type)}
              </m.span>

              {/* Current week indicator */}
              {isCurrentWeek && (
                <m.span
                  className="px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded text-[10px] sm:text-xs font-medium"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('current')}
                </m.span>
              )}

              {/* Past week indicator */}
              {isPastWeek && (
                <m.span
                  className="px-2 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded text-[10px] sm:text-xs font-medium"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('pastWeek')}
                </m.span>
              )}
            </div>

            <h3 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 dark:text-white">
              {(() => {
                const cycleName = getCycleName(block.cycleNumber);
                const displayCycleName = cycleName || `${tCalendar('cycle')} ${block.cycleNumber}`;
                // Construct string with user-defined cycle name
                if (locale === 'tr') {
                  return `${displayCycleName}. Döngünün ${block.weekInCycle}. Haftası`;
                } else {
                  return `Week ${block.weekInCycle} of ${displayCycleName}`;
                }
              })()}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {weekRange}
            </p>
          </div>

          {/* Expand icon */}
          <m.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-400 dark:text-gray-500 flex-shrink-0"
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </m.div>
        </div>

        {/* Expanded content */}
        <m.div
          initial={false}
          animate={{
            height: isExpanded ? "auto" : 0,
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {t('startDate')}
                </span>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {formatFullDateWithWeekday(block.start, locale)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {t('endDate')}
                </span>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {formatFullDateWithWeekday(new Date(block.end.getTime() - 1), locale)}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {t('cycle')}
                </span>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {cycleName || `${tCalendar('cycle')} ${block.cycleNumber}`}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-500 dark:text-gray-400">
                  {t('weekInCycle')}
                </span>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {t('weekFormat', { current: block.weekInCycle })}
                </p>
              </div>
            </div>
          </div>
        </m.div>
      </m.div>

      {/* Decorative gradient */}
      <m.div
        className={`
          absolute inset-0 opacity-0 pointer-events-none
          bg-gradient-to-r
          ${
            block.type === "work"
              ? "from-work-500/10 to-transparent"
              : "from-rest-500/10 to-transparent"
          }
        `}
        animate={{ opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Strikethrough line for past weeks */}
      {isPastWeek && strikethroughEnabled && (
        <m.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{ originX: 0 }}
        >
          <div
            className="w-full h-[1px] bg-gray-400 dark:bg-gray-600 opacity-40"
            style={{
              transform: 'rotate(-3deg)',
            }}
          />
        </m.div>
      )}
    </m.div>
  );
}

/**
 * List view of all weeks with expandable details.
 * Highlights the current week and provides cycle context for each block.
 */
export function AgendaList({ blocks, currentBlock }: AgendaListProps) {
  const t = useTranslations('agenda');
  const [showPastWeeks, setShowPastWeeks] = useState(false);
  const [strikethroughPastWeeks, setStrikethroughPastWeeks] = useState(true);

  // Categorize blocks into past, current, and future
  const categorizedBlocks = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    return blocks.map(block => {
      const isCurrentWeek = !!(
        currentBlock &&
        block.cycleNumber === currentBlock.cycleNumber &&
        block.weekInCycle === currentBlock.weekInCycle
      );
      
      // Normalize block.end to start of day for comparison
      const blockEndStart = new Date(block.end.getFullYear(), block.end.getMonth(), block.end.getDate());
      const isPastWeek = blockEndStart <= todayStart && !isCurrentWeek;
      
      return {
        ...block,
        isCurrentWeek,
        isPastWeek,
      };
    });
  }, [blocks, currentBlock]);

  // Filter and sort blocks: future weeks, then current week, then past weeks
  const displayedBlocks = useMemo(() => {
    let filtered = categorizedBlocks;
    
    const pastCount = categorizedBlocks.filter(b => b.isPastWeek).length;
    const currentCount = categorizedBlocks.filter(b => b.isCurrentWeek).length;
    const futureCount = categorizedBlocks.filter(b => !b.isPastWeek && !b.isCurrentWeek).length;
    
    console.log(`AgendaList: Total blocks: ${categorizedBlocks.length}, Past: ${pastCount}, Current: ${currentCount}, Future: ${futureCount}, showPastWeeks: ${showPastWeeks}`);
    
    // Filter out past weeks if showPastWeeks is false
    if (!showPastWeeks) {
      filtered = filtered.filter(b => !b.isPastWeek);
      console.log(`AgendaList: Filtered to ${filtered.length} blocks (hiding past weeks)`);
    }

    // Sort: future weeks first, then current week, then past weeks
    // Within each category, maintain chronological order
    const sorted = [...filtered].sort((a, b) => {
      // Determine categories for both blocks
      const aCat = a.isCurrentWeek ? 1 : (a.isPastWeek ? 2 : 0); // 0=future, 1=current, 2=past
      const bCat = b.isCurrentWeek ? 1 : (b.isPastWeek ? 2 : 0);
      
      // If different categories, sort by category
      if (aCat !== bCat) {
        return aCat - bCat;
      }
      
      // Within same category, maintain original order (already chronological)
      return 0;
    });
    
    console.log(`AgendaList: Display order - First block: cycle ${sorted[0]?.cycleNumber}, week ${sorted[0]?.weekInCycle}, isPast: ${sorted[0]?.isPastWeek}, isCurrent: ${sorted[0]?.isCurrentWeek}`);
    
    return sorted;
  }, [categorizedBlocks, showPastWeeks]);
  
  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 sm:space-y-4 px-2 sm:px-0">
      <m.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-gray-900 dark:text-white">{t('title')}</h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {t('instruction')}
        </p>
      </m.div>

      {/* Filter controls */}
      <m.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3"
      >
        <div className="flex items-center justify-between">
          <label htmlFor="showPastWeeks" className="flex items-center gap-2 cursor-pointer select-none">
            <input
              id="showPastWeeks"
              type="checkbox"
              checked={showPastWeeks}
              onChange={(e) => {
                console.log('Show Past Weeks checkbox clicked:', e.target.checked);
                setShowPastWeeks(e.target.checked);
              }}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-0 focus:ring-gray-900 dark:focus:ring-white cursor-pointer accent-gray-900 dark:accent-white"
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {t('showPastWeeks')}
            </span>
          </label>
        </div>

        <AnimatePresence>
          {showPastWeeks && (
            <m.div
              key="strikethrough-option"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between pl-6">
                <label htmlFor="strikethroughPastWeeks" className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="strikethroughPastWeeks"
                    type="checkbox"
                    checked={strikethroughPastWeeks}
                    onChange={(e) => setStrikethroughPastWeeks(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-offset-0 focus:ring-gray-900 dark:focus:ring-white cursor-pointer accent-gray-900 dark:accent-white"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('strikethroughPastWeeks')}
                  </span>
                </label>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>

      <div className="space-y-2 sm:space-y-3">
        {displayedBlocks.map((block, index) => {
          return (
            <AgendaItem
              key={`${block.cycleNumber}-${block.weekInCycle}`}
              block={block}
              index={index}
              isCurrentWeek={block.isCurrentWeek}
              isPastWeek={block.isPastWeek}
              strikethroughEnabled={strikethroughPastWeeks}
            />
          );
        })}
      </div>

      {/* End of list indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: displayedBlocks.length * 0.05 }}
        className="text-center py-8 text-gray-400 dark:text-gray-600"
      >
        <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-700 mx-auto mb-2" />
        <p className="text-sm">{t('endOfYear')}</p>
      </m.div>
    </div>
  );
}

