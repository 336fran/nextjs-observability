import { metrics } from '@opentelemetry/api';

// Get the global meter
const meter = metrics.getMeter('nextjs-app');  // , '0.1.0'

// Create metric instruments
export const sessionsCreatedCounter = meter.createCounter('sessions_created_total', {
  description: 'Total number of unique sessions created',
  unit: '1',
});

// Session Duration: Bounce < 5s | Quick 5-30s | Brief 30s-2m | Moderate 2-10m | Strong 10-30m | Very Strong 30m-1h | Extended > 1h
export const sessionDurationHistogram = meter.createHistogram('session_duration_seconds', {
  description: 'Duration of sessions in seconds',
  unit: 's',
  advice: {
    explicitBucketBoundaries: [5, 30, 120, 600, 1800, 3600, 7200],
  },
});

export const pageViewsCounter = meter.createCounter('page_views_total', {
  description: 'Total number of page views',
  unit: '1',
});

// Web Vitals metrics with Google's thresholds as buckets (simplified to 6 buckets)
// FCP: Good < 1800ms, Needs Improvement < 3000ms, Poor >= 3000ms
export const fcpHistogram = meter.createHistogram('fcp_milliseconds', {
  description: 'First Contentful Paint metric',
  unit: 'ms',
  advice: {
    explicitBucketBoundaries: [600, 1200, 1800, 2500, 3000, 4000],
  },
});

// LCP: Good < 2500ms, Needs Improvement < 4000ms, Poor >= 4000ms
export const lcpHistogram = meter.createHistogram('lcp_milliseconds', {
  description: 'Largest Contentful Paint metric',
  unit: 'ms',
  advice: {
    explicitBucketBoundaries: [600, 1200, 1800, 2500, 3000, 4000],
  },
});

// CLS: Good < 0.1, Needs Improvement < 0.25, Poor >= 0.25
export const clsHistogram = meter.createHistogram('cls_score', {
  description: 'Cumulative Layout Shift metric (unitless)',
  unit: '1',
  advice: {
    explicitBucketBoundaries: [0.025, 0.05, 0.1, 0.15, 0.25, 0.5],
  },
});

// TTFB: Good < 600ms, Needs Improvement < 1800ms, Poor >= 1800ms
export const ttfbHistogram = meter.createHistogram('ttfb_milliseconds', {
  description: 'Time to First Byte metric',
  unit: 'ms',
  advice: {
    explicitBucketBoundaries: [100, 300, 600, 1000, 1800, 3000],
  },
});

// INP: Good < 200ms, Needs Improvement < 500ms, Poor >= 500ms
export const inpHistogram = meter.createHistogram('inp_milliseconds', {
  description: 'Interaction to Next Paint metric',
  unit: 'ms',
  advice: {
    explicitBucketBoundaries: [50, 100, 200, 300, 500, 1000],
  },
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

/**
 * Record web vitals metrics
 */
export function recordWebVital(name: string, value: number, pathname: string) {
  const labels = { pathname };

  switch (name) {
    case 'FCP':
    case 'Next.js-before-hydration':
      fcpHistogram.record(value, labels);
      break;
    case 'LCP':
      lcpHistogram.record(value, labels);
      break;
    case 'CLS':
      clsHistogram.record(value, labels);
      break;
    case 'TTFB':
      ttfbHistogram.record(value, labels);
      break;
    case 'INP':
      inpHistogram.record(value, labels);
      break;
  }

  console.log(`[WEB_VITAL] ${name}: ${value}ms (${pathname})`);
}
