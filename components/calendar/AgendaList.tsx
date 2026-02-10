"use client";

import { m, useInView, AnimatePresence } from "motion/react";
import { useRef, useState, useMemo, useCallback } from "react";
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

  // Filter and sort blocks: current week first, then future weeks, then past weeks
  const displayedBlocks = useMemo(() => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const isBlockCurrent = (block: Block) => {
      return !!(
        currentBlock &&
        block.cycleNumber === currentBlock.cycleNumber &&
        block.weekInCycle === currentBlock.weekInCycle
      );
    };

    const isBlockPast = (block: Block) => {
      const blockEndStart = new Date(block.end.getFullYear(), block.end.getMonth(), block.end.getDate());
      return blockEndStart <= todayStart && !isBlockCurrent(block);
    };

    // Filter based on showPastWeeks
    const filtered = showPastWeeks 
      ? blocks 
      : blocks.filter(b => !isBlockPast(b));

    // Sort: past weeks first (chronological), then current, then future
    // This way past weeks are immediately visible at the top when toggled on
    return [...filtered].sort((a, b) => {
      const aIsCurrent = isBlockCurrent(a);
      const bIsCurrent = isBlockCurrent(b);
      const aIsPast = isBlockPast(a);
      const bIsPast = isBlockPast(b);
      
      // Determine categories: 0=past, 1=current, 2=future
      const aCat = aIsPast ? 0 : (aIsCurrent ? 1 : 2);
      const bCat = bIsPast ? 0 : (bIsCurrent ? 1 : 2);
      
      return aCat - bCat;
    });
  }, [blocks, currentBlock, showPastWeeks]);
  
  // Helper functions for rendering
  const isBlockCurrent = useCallback((block: Block) => {
    return !!(
      currentBlock &&
      block.cycleNumber === currentBlock.cycleNumber &&
      block.weekInCycle === currentBlock.weekInCycle
    );
  }, [currentBlock]);

  const isBlockPast = useCallback((block: Block) => {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const blockEndStart = new Date(block.end.getFullYear(), block.end.getMonth(), block.end.getDate());
    return blockEndStart <= todayStart && !isBlockCurrent(block);
  }, [currentBlock, isBlockCurrent]);
  
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
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-3">
        <div className="flex items-center gap-3">
          <input
            id="showPastWeeks"
            type="checkbox"
            checked={showPastWeeks}
            onChange={(e) => setShowPastWeeks(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="showPastWeeks" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer flex-1">
            {t('showPastWeeks')}
          </label>
          {showPastWeeks && (
            <m.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-2 py-1 bg-gray-500 dark:bg-gray-600 text-white rounded text-xs font-medium"
            >
              {displayedBlocks.filter(b => isBlockPast(b)).length} past
            </m.span>
          )}
        </div>

        {showPastWeeks && (
          <div className="flex items-center gap-3 pl-6 pt-2">
            <input
              id="strikethroughPastWeeks"
              type="checkbox"
              checked={strikethroughPastWeeks}
              onChange={(e) => setStrikethroughPastWeeks(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="strikethroughPastWeeks" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
              {t('strikethroughPastWeeks')}
            </label>
          </div>
        )}
      </div>

      <div className="space-y-2 sm:space-y-3">
        {displayedBlocks.map((block, index) => {
          const isPast = isBlockPast(block);
          const isCurrent = isBlockCurrent(block);
          const nextBlock = displayedBlocks[index + 1];
          // Show separator after the last past week (before current/future weeks)
          const showPastSeparator = showPastWeeks && 
            isPast && 
            nextBlock && 
            !isBlockPast(nextBlock);

          return (
            <div key={`${block.cycleNumber}-${block.weekInCycle}`}>
              <AgendaItem
                block={block}
                index={index}
                isCurrentWeek={isCurrent}
                isPastWeek={isPast}
                strikethroughEnabled={strikethroughPastWeeks}
              />
              {showPastSeparator && (
                <m.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 my-6 sm:my-8"
                >
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    ↑ Past Weeks Above ({displayedBlocks.filter(b => isBlockPast(b)).length})
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
                </m.div>
              )}
            </div>
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

