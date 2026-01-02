"use client";

import { m, useInView } from "motion/react";
import { useRef, useState } from "react";
import { useTranslations, useLocale } from 'next-intl';
import { formatFullDateWithWeekday, formatDateRange, type Locale } from "@/lib/i18n/dateFormats";
import type { Block } from "@/lib/calendar/types";

interface AgendaListProps {
  blocks: Block[];
  currentBlock?: Block;
}

function AgendaItem({
  block,
  index,
  isCurrentWeek,
}: {
  block: Block;
  index: number;
  isCurrentWeek: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const t = useTranslations('agenda');
  const locale = useLocale() as Locale;

  const weekRange = formatDateRange(
    block.start,
    new Date(block.end.getTime() - 1),
    locale
  );

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
      `}
    >
      <m.div
        className={`
          p-4 sm:p-6 cursor-pointer
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
            </div>

            <h3 className="text-base sm:text-lg font-semibold mb-1 text-gray-900 dark:text-white">
              {t('weekOfCycle', { week: block.weekInCycle, cycle: block.cycleNumber })}
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
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">#{block.cycleNumber}</p>
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
    </m.div>
  );
}

/**
 * List view of all weeks with expandable details.
 * Highlights the current week and provides cycle context for each block.
 */
export function AgendaList({ blocks, currentBlock }: AgendaListProps) {
  const t = useTranslations('agenda');
  
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

      <div className="space-y-2 sm:space-y-3">
        {blocks.map((block, index) => {
          const isCurrentWeek = !!(
            currentBlock &&
            block.cycleNumber === currentBlock.cycleNumber &&
            block.weekInCycle === currentBlock.weekInCycle
          );

          return (
            <AgendaItem
              key={`${block.cycleNumber}-${block.weekInCycle}`}
              block={block}
              index={index}
              isCurrentWeek={isCurrentWeek}
            />
          );
        })}
      </div>

      {/* End of list indicator */}
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: blocks.length * 0.05 }}
        className="text-center py-8 text-gray-400 dark:text-gray-600"
      >
        <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-700 mx-auto mb-2" />
        <p className="text-sm">{t('endOfYear')}</p>
      </m.div>
    </div>
  );
}

