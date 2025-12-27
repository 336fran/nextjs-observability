'use client';

import { usePageViewTracking } from '../hooks/usePageViewTracking';

export function PageViewTracker() {
  usePageViewTracking();
  return null;
}
