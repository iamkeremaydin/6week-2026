"use client";

import { m } from "motion/react";
import { useLanguage } from '@/lib/i18n/LanguageProvider';

/**
 * Language switcher toggle button (EN/TR).
 * Switches between locales without changing the URL.
 * Uses browser language detection on first visit, then saves preference to localStorage.
 */
export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const handleLanguageToggle = () => {
    const newLocale = locale === 'tr' ? 'en' : 'tr';
    setLocale(newLocale);
  };

  return (
    <m.button
      onClick={handleLanguageToggle}
      className="fixed bottom-20 right-4 sm:top-4 sm:bottom-auto sm:right-20 z-50 p-2 sm:p-3 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 hover:border-work-400 dark:hover:border-work-600 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      title={locale === 'en' ? 'Türkçe' : 'English'}
    >
      <div className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2">
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
      </div>
    </m.button>
  );
}

