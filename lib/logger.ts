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
 * Creates a child logger with a specific module context
 * @param module - The module name to tag logs with
 * @returns A child logger instance with module context
 * 
 * @example
 * ```ts
 * const log = createLogger('CalendarView');
 * log.info('Rendering calendar');
 * log.error({ error }, 'Failed to load data');
 * ```
 */
export const createLogger = (module: string) => {
  return logger.child({ module });
};

