/**
 * Structured logging with Pino.
 * Logs are prettified in development and JSON-formatted in production.
 */

import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  browser: {
    asObject: true,
  },
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
      },
    },
  }),
});

/**
 * Creates a tagged logger for a specific module.
 * Use this to identify log sources in production.
 * 
 * @param module - Module identifier for log tagging
 * @returns Child logger with module context
 * @example
 * ```ts
 * const log = createLogger('CalendarView');
 * log.info('Component mounted');
 * log.error({ error }, 'Failed to fetch');
 * ```
 */
export const createLogger = (module: string) => {
  return logger.child({ module });
};

