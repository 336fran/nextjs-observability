'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getOrCreateSessionData, isNewSession } from '../lib/sessionTracker';

export function usePageViewTracking() {
  const pathname = usePathname();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
    const referrer = typeof document !== 'undefined' ? document.referrer : 'direct';

    // Get or create session data
    const sessionData = getOrCreateSessionData(pathname, referrer);
    const isNew = isNewSession(sessionData);

    const pageViewData = {
      pathname,
      userAgent,
      referrer,
      timestamp,
      sessionData,
      isNewSession: isNew,
    };

    // Log to console for debugging
    console.log(`[PAGE_VIEW_CLIENT] ${pathname} at ${timestamp}`, pageViewData);
    if (isNew) {
      console.log('[PAGE_VIEW_CLIENT] NEW SESSION DETECTED');
    }

    // Send to analytics API endpoint
    fetch('/api/analytics/page-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageViewData),
    }).catch(err => console.error('Failed to track page view:', err));
  }, [pathname]);
}
