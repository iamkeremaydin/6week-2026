"use client";

import { CalendarView } from "@/components/calendar/CalendarView";
import { m } from "motion/react";
import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const t = useTranslations('home');

  // Apply dark mode on mount since it's the default theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen">
      {/* Main calendar */}
      <CalendarView
        year={2026}
        cycleStartDate={new Date(2026, 0, 1)}
        workWeeks={6}
        restWeeks={1}
        weekStartsOn={1}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Info section */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 pt-12 sm:pt-8 md:px-8 pb-8 sm:pb-12">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-4 px-2">
              {t('methodologyTitle')}
            </h2>
            <p className="text-base sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              {t('methodologyDesc')}
            </p>
          </m.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-4 md:gap-6">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-work-50 dark:bg-work-950 p-6 sm:p-4 md:p-6 rounded-xl"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-work-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{t('workWeeksTitle')}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t('workWeeksDesc')}
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-rest-50 dark:bg-rest-950 p-6 sm:p-4 md:p-6 rounded-xl"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rest-500 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{t('restWeekTitle')}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t('restWeekDesc')}
              </p>
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 dark:bg-gray-800 p-6 sm:p-4 md:p-6 rounded-xl"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white dark:text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">{t('repeatableCycleTitle')}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {t('repeatableCycleDesc')}
              </p>
            </m.div>
          </div>

          {/* Features */}
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 sm:mt-12 text-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('featuresTitle')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 md:gap-6">
              <div className="p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">🎨</div>
                <h4 className="text-sm sm:text-base font-semibold mb-1">{t('premiumAnimations')}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('premiumAnimationsDesc')}
                </p>
              </div>
              <div className="p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">📅</div>
                <h4 className="text-sm sm:text-base font-semibold mb-1">{t('threeViewModes')}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('threeViewModesDesc')}
                </p>
              </div>
              <div className="p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">🌓</div>
                <h4 className="text-sm sm:text-base font-semibold mb-1">{t('darkMode')}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('darkModeDesc')}
                </p>
              </div>
              <div className="p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                <h4 className="text-sm sm:text-base font-semibold mb-1">{t('performanceFirst')}</h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {t('performanceFirstDesc')}
                </p>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </div>
  );
}

