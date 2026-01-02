/**
 * Next.js instrumentation hook for OpenTelemetry setup.
 * Loaded automatically before server start to enable distributed tracing.
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */

export async function register() {
  // Skip Edge runtime as OpenTelemetry requires Node.js APIs
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { registerOTel } = await import('@vercel/otel');
    
    registerOTel({
      serviceName: '6week-calendar',
    });
  }
}

