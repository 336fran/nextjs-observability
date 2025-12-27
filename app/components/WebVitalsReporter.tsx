'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { usePathname } from 'next/navigation';
import { recordWebVital } from '../lib/metrics';
import { useEffect } from 'react';

export function WebVitalsReporter() {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    // Record the metric to OpenTelemetry
    recordWebVital(metric.name, metric.value, pathname);

    // Also log detailed metric info
    console.log(`Web Vital - ${metric.name}:`, {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      pathname,
    });
  });

  return null;
}
