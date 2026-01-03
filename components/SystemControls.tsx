"use client";

import { m } from "motion/react";
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { SunIcon, MoonIcon } from "@/components/icons";

interface SystemControlsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

/**
 * System-level controls for language and theme.
 * Positioned in a dedicated, consistent control area.
 */
export function SystemControls({ isDarkMode, onToggleDarkMode }: SystemControlsProps) {
  const { locale, setLocale } = useLanguage();

  const handleLanguageToggle = () => {
    const newLocale = locale === 'tr' ? 'en' : 'tr';
    setLocale(newLocale);
  };

  return (
    <m.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-3"
    >
      {/* Language Switcher */}
      <m.button
        onClick={handleLanguageToggle}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 hover:border-work-400 dark:hover:border-work-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title={locale === 'en' ? 'Türkçe' : 'English'}
      >
        <span className={`text-xs sm:text-sm font-bold transition-colors ${locale === 'en' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
          EN
        </span>
        <div className="w-8 sm:w-10 h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded-full p-0.5 relative">
          <m.div
            className="w-3 h-3 sm:w-4 sm:h-4 bg-work-500 dark:bg-work-400 rounded-full"
            animate={{
              x: locale === 'tr' ? '100%' : '0%'
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
        <span className={`text-xs sm:text-sm font-bold transition-colors ${locale === 'tr' ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
          TR
        </span>
      </m.button>

      {/* Dark Mode Toggle */}
      <m.button
        onClick={onToggleDarkMode}
        className="p-2.5 sm:p-3 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800 hover:border-work-400 dark:hover:border-work-600 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <SunIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
        )}
      </m.button>
    </m.div>
  );
}

