import { format as dateFnsFormat } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

/**
 * Locale-aware date formatting utilities for Turkish and English.
 * Turkish: Day-first format (1 Ocak 2026)
 * English: Month-first format (Jan 1, 2026)
 */

const locales = {
  en: enUS,
  tr: tr,
} as const;

export type Locale = keyof typeof locales;

/**
 * Format a date according to the specified locale and pattern
 */
export function formatDate(
  date: Date,
  formatStr: string,
  locale: Locale = 'en'
): string {
  return dateFnsFormat(date, formatStr, { locale: locales[locale] });
}

/**
 * Get month names for a specific locale
 */
export function getMonthNames(locale: Locale = 'en'): string[] {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(formatDate(date, 'MMMM', locale));
  }
  return months;
}

/**
 * Get short month names for a specific locale
 */
export function getShortMonthNames(locale: Locale = 'en'): string[] {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(formatDate(date, 'MMM', locale));
  }
  return months;
}

/**
 * Get weekday names for a specific locale
 */
export function getWeekdayNames(locale: Locale = 'en'): string[] {
  const weekdays = [];
  // Start from Monday (2024-01-01 was a Monday)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(2024, 0, i);
    weekdays.push(formatDate(date, 'EEEE', locale));
  }
  return weekdays;
}

/**
 * Get short weekday names for a specific locale
 */
export function getShortWeekdayNames(locale: Locale = 'en'): string[] {
  const weekdays = [];
  // Start from Monday (2024-01-01 was a Monday)
  for (let i = 1; i <= 7; i++) {
    const date = new Date(2024, 0, i);
    weekdays.push(formatDate(date, 'EEE', locale));
  }
  return weekdays;
}

/**
 * Format a date range according to locale conventions
 * English: "Jan 1 - Jan 7, 2026"
 * Turkish: "1 Oca - 7 Oca 2026"
 */
export function formatDateRange(
  startDate: Date,
  endDate: Date,
  locale: Locale = 'en'
): string {
  if (locale === 'tr') {
    const start = formatDate(startDate, 'd MMM', locale);
    const end = formatDate(endDate, 'd MMM yyyy', locale);
    return `${start} - ${end}`;
  } else {
    const start = formatDate(startDate, 'MMM d', locale);
    const end = formatDate(endDate, 'MMM d, yyyy', locale);
    return `${start} - ${end}`;
  }
}

/**
 * Format a full date according to locale conventions
 * English: "January 1, 2026" or "Jan 1, 2026"
 * Turkish: "1 Ocak 2026" or "1 Oca 2026"
 */
export function formatFullDate(
  date: Date,
  locale: Locale = 'en',
  short: boolean = false
): string {
  if (locale === 'tr') {
    return formatDate(date, short ? 'd MMM yyyy' : 'd MMMM yyyy', locale);
  } else {
    return formatDate(date, short ? 'MMM d, yyyy' : 'MMMM d, yyyy', locale);
  }
}

/**
 * Format a date with day of week
 * English: "Monday, January 1, 2026"
 * Turkish: "Pazartesi, 1 Ocak 2026"
 */
export function formatFullDateWithWeekday(
  date: Date,
  locale: Locale = 'en'
): string {
  if (locale === 'tr') {
    return formatDate(date, 'EEEE, d MMMM yyyy', locale);
  } else {
    return formatDate(date, 'EEEE, MMMM d, yyyy', locale);
  }
}

/**
 * Format month and year
 * English: "January 2026"
 * Turkish: "Ocak 2026"
 */
export function formatMonthYear(
  date: Date,
  locale: Locale = 'en'
): string {
  return formatDate(date, 'MMMM yyyy', locale);
}

