/**
 * Constants and configuration values for the calendar application
 */

// Dimension constants for UI elements
export const DIMENSIONS = {
  // Week block dimensions
  WEEK_BLOCK_WIDTH: 64,
  WEEK_BLOCK_HEIGHT: 128,
  WEEK_BLOCK_GAP: 4,
  
  // Calculated values
  get WEEK_BLOCK_WITH_GAP() {
    return this.WEEK_BLOCK_WIDTH + this.WEEK_BLOCK_GAP;
  },
  
  // Cycle marker dimensions
  CYCLE_MARKER_HEIGHT: 160,
  CYCLE_MARKER_WIDTH: 4,
  CYCLE_MARKER_DOT_SIZE: 12,
  
  // Label dimensions
  LABEL_WIDTH: 96,
} as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  // Durations (in seconds)
  DURATION_FAST: 0.2,
  DURATION_NORMAL: 0.3,
  DURATION_SLOW: 0.5,
  
  // Delays
  DELAY_STAGGER: 0.01,
  DELAY_MONTH_STAGGER: 0.1,
  DELAY_SHORT: 0.2,
  DELAY_NORMAL: 0.3,
  DELAY_LONG: 0.5,
  
  // Easing curves
  EASING_EXPO: [0.19, 1, 0.22, 1] as const,
  EASING_IN_EXPO: [0.95, 0.05, 0.795, 0.035] as const,
  EASING_OUT_EXPO: [0.19, 1, 0.22, 1] as const,
  
  // Scale values
  SCALE_HOVER: 1.05,
  SCALE_TAP: 0.95,
  SCALE_INITIAL: 0.95,
  SCALE_NORMAL: 1,
  
  // Animation arrays for complex animations
  CURRENT_WEEK_SCALE: [0, 1.2, 1] as const,
} as const;

// Cycle configuration defaults
export const CYCLE_CONFIG = {
  DEFAULT_WORK_WEEKS: 6,
  DEFAULT_REST_WEEKS: 1,
  TOTAL_WEEKS_IN_CYCLE: 7,
  DEFAULT_WEEK_STARTS_ON: 1 as 0 | 1, // 1 = Monday, 0 = Sunday
} as const;

// UI configuration
export const UI_CONFIG = {
  // Z-index layers
  Z_INDEX: {
    BASE: 0,
    TOOLTIP: 10,
    MODAL: 20,
    OVERLAY: 30,
    DARK_MODE_TOGGLE: 50,
  },
  
  // Breakpoints (matching Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
  },
  
  // Ring widths
  RING_WIDTH: {
    NORMAL: 2,
    THICK: 4,
  },
  
  // Opacity values
  OPACITY: {
    DISABLED: 0.5,
    SECONDARY: 0.6,
    TERTIARY: 0.75,
  },
  
  // Border radius
  BORDER_RADIUS: {
    SM: 'rounded-md',
    MD: 'rounded-lg',
    LG: 'rounded-xl',
    FULL: 'rounded-full',
  },
} as const;

// Date format strings
export const DATE_FORMATS = {
  MONTH_SHORT: "MMM d",
  MONTH_LONG: "MMMM d, yyyy",
  MONTH_YEAR: "MMM yyyy",
  FULL_DATE: "EEEE, MMMM d, yyyy",
} as const;

// Text constants
export const TEXT = {
  CYCLE_LABEL_PLACEHOLDER: "Click to edit",
  SCROLL_INDICATOR: "← Scroll to explore the year →",
} as const;

