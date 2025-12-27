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

  // Track session end (beforeunload or pagehide)
  useEffect(() => {
    const handleSessionEnd = async () => {
      if (typeof window === 'undefined') return;

      const sessionDataStr = sessionStorage.getItem('sessionData');
      if (!sessionDataStr) return;

      const sessionData = JSON.parse(sessionDataStr);
      const timestamp = new Date().toISOString();

      const sessionEndData = {
        sessionId: sessionData.sessionId,
        sessionStartTime: sessionData.sessionStartTime,
        timestamp,
        pageViewCount: sessionData.pageViewCount,
        firstPage: sessionData.firstPage,
        lastPage: sessionData.lastPage,
        firstReferrer: sessionData.firstReferrer,
      };

      console.log('[PAGE_VIEW_CLIENT] SESSION ENDED', sessionEndData);

      // Send session end event to API
      // Using sendBeacon for reliability as the page is unloading
      const blob = new Blob([JSON.stringify(sessionEndData)], {
        type: 'application/json',
      });
      navigator.sendBeacon('/api/analytics/session-end', blob);
    };

    window.addEventListener('beforeunload', handleSessionEnd);
    window.addEventListener('pagehide', handleSessionEnd);

    return () => {
      window.removeEventListener('beforeunload', handleSessionEnd);
      window.removeEventListener('pagehide', handleSessionEnd);
    };
  }, []);
}
