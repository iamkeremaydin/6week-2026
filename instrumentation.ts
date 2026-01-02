/**
 * Next.js Instrumentation Hook
 * This file is automatically loaded before the Next.js server starts
 * Perfect for setting up OpenTelemetry tracing and observability
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

export async function register() {
  // Only run OpenTelemetry in Node.js runtime (not Edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel');
    
    registerOTel({
      serviceName: '6week-calendar',
    });
  }
}

