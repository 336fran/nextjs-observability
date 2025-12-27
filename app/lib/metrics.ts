import { metrics } from '@opentelemetry/api';

// Get the global meter
const meter = metrics.getMeter('nextjs-app', '0.1.0');

// Create metric instruments
export const sessionsCreatedCounter = meter.createCounter('sessions_created_total', {
  description: 'Total number of unique sessions created',
  unit: '1',
});

export const sessionDurationHistogram = meter.createHistogram('session_duration_seconds', {
  description: 'Duration of sessions in seconds',
  unit: 's',
});

export const pageViewsCounter = meter.createCounter('page_views_total', {
  description: 'Total number of page views',
  unit: '1',
});

/**
 * Record a new session creation
 */
export function recordSessionCreated(landingPage: string, referrer: string) {
  sessionsCreatedCounter.add(1, {
    landing_page: landingPage,
    referrer: referrer,
  });
}

/**
 * Record session duration
 */
export function recordSessionDuration(durationSeconds: number, landingPage: string, referrer: string) {
  sessionDurationHistogram.record(durationSeconds, {
    landing_page: landingPage,
    referrer: referrer,
  });
}

/**
 * Record a page view
 */
export function recordPageView(pathname: string) {
  pageViewsCounter.add(1, {
    pathname: pathname,
    // referrer: referrer,
  });
}
