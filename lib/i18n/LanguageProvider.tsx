"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type Locale = 'en' | 'tr';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

/**
 * Detects the initial locale synchronously on client side.
 * Checks localStorage first, then browser language.
 * This runs during state initialization to prevent language flicker.
 */
function getInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'en'; // SSR fallback
  }

  // Check localStorage first (user preference)
  const stored = localStorage.getItem('preferred-locale') as Locale | null;
  if (stored && (stored === 'en' || stored === 'tr')) {
    return stored;
  }

  // Detect browser language
  const browserLang = navigator.language.toLowerCase();
  const detectedLocale = browserLang.startsWith('tr') ? 'tr' : 'en';
  
  // Save detected language to localStorage for consistency
  localStorage.setItem('preferred-locale', detectedLocale);
  
  return detectedLocale;
}

/**
 * Language provider that detects browser language and manages locale state.
 * - Detects Turkish browser → defaults to Turkish
 * - All other languages → defaults to English
 * - Persists choice in localStorage
 * - No URL routing required
 * - Synchronous detection prevents first-render language mismatch
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with detected language synchronously to prevent flicker
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [messages, setMessages] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load messages immediately on mount and when locale changes
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const msgs = await import(`@/i18n/locales/${locale}.json`);
        setMessages(msgs.default);
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English if locale file fails to load
        if (locale !== 'en') {
          const enMsgs = await import(`@/i18n/locales/en.json`);
          setMessages(enMsgs.default);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferred-locale', newLocale);
  };

  if (isLoading || !messages) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

