/**
 * Centralized configuration constants for the calendar application.
 * All magic numbers and hardcoded values should be defined here to prevent duplication.
 */

/** Pixel dimensions for UI elements. */
export const DIMENSIONS = {
  WEEK_BLOCK_WIDTH: 64,
  WEEK_BLOCK_HEIGHT: 128,
  WEEK_BLOCK_GAP: 4,
  
  get WEEK_BLOCK_WITH_GAP() {
    return this.WEEK_BLOCK_WIDTH + this.WEEK_BLOCK_GAP;
  },
  
  CYCLE_MARKER_HEIGHT: 160,
  CYCLE_MARKER_WIDTH: 4,
  CYCLE_MARKER_DOT_SIZE: 12,
  LABEL_WIDTH: 96,
} as const;

/** Animation timings and easing curves (durations in seconds). */
export const ANIMATION_CONFIG = {
  DURATION_FAST: 0.2,
  DURATION_NORMAL: 0.3,
  DURATION_SLOW: 0.5,
  
  DELAY_STAGGER: 0.01,
  DELAY_MONTH_STAGGER: 0.1,
  DELAY_SHORT: 0.2,
  DELAY_NORMAL: 0.3,
  DELAY_LONG: 0.5,
  
  EASING_EXPO: [0.19, 1, 0.22, 1] as const,
  EASING_IN_EXPO: [0.95, 0.05, 0.795, 0.035] as const,
  EASING_OUT_EXPO: [0.19, 1, 0.22, 1] as const,
  
  SCALE_HOVER: 1.05,
  SCALE_TAP: 0.95,
  SCALE_INITIAL: 0.95,
  SCALE_NORMAL: 1,
  
  CURRENT_WEEK_SCALE: [0, 1.2, 1] as const,
} as const;

/** Default values for cycle generation. */
export const CYCLE_CONFIG = {
  DEFAULT_WORK_WEEKS: 6,
  DEFAULT_REST_WEEKS: 1,
  TOTAL_WEEKS_IN_CYCLE: 7,
  DEFAULT_WEEK_STARTS_ON: 1 as 0 | 1,
} as const;

/** UI styling and layout constants. */
export const UI_CONFIG = {
  Z_INDEX: {
    BASE: 0,
    TOOLTIP: 10,
    MODAL: 20,
    OVERLAY: 30,
    DARK_MODE_TOGGLE: 50,
  },
  
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  
  RING_WIDTH: {
    NORMAL: 2,
    THICK: 4,
  },
  
  OPACITY: {
    DISABLED: 0.5,
    SECONDARY: 0.6,
    TERTIARY: 0.75,
  },
  
  BORDER_RADIUS: {
    SM: 'rounded-md',
    MD: 'rounded-lg',
    LG: 'rounded-xl',
    FULL: 'rounded-full',
  },
} as const;

/** date-fns format strings. */
export const DATE_FORMATS = {
  MONTH_SHORT: "MMM d",
  MONTH_LONG: "MMMM d, yyyy",
  MONTH_YEAR: "MMM yyyy",
  FULL_DATE: "EEEE, MMMM d, yyyy",
} as const;

/** User-facing text strings. */
export const TEXT = {
  CYCLE_LABEL_PLACEHOLDER: "Click to edit",
  SCROLL_INDICATOR: "← Scroll to explore the year →",
} as const;

