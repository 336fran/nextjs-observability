'use client';

// Generate a UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface SessionData {
  sessionId: string;
  sessionStartTime: string;
  pageViewCount: number;
  firstPage: string;
  lastPage: string;
  lastActivityTime: string;
  firstReferrer: string;
  events: {
    pageViews: number;
    [key: string]: number;
  };
}

const SESSION_STORAGE_KEY = 'sessionData';

/**
 * Get or create session data from sessionStorage
 */
export function getOrCreateSessionData(currentPath: string, referrer: string): SessionData {
  if (typeof window === 'undefined') {
    return createNewSession(currentPath, referrer);
  }

  let sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!sessionData) {
    // New session
    return createNewSession(currentPath, referrer);
  }

  // Existing session - update it
  const data: SessionData = JSON.parse(sessionData);
  data.pageViewCount += 1;
  data.lastPage = currentPath;
  data.lastActivityTime = new Date().toISOString();
  data.events.pageViews += 1;

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
  return data;
}

/**
 * Create a new session
 */
function createNewSession(currentPath: string, referrer: string): SessionData {
  const now = new Date().toISOString();
  const sessionData: SessionData = {
    sessionId: generateUUID(),
    sessionStartTime: now,
    pageViewCount: 1,
    firstPage: currentPath,
    lastPage: currentPath,
    lastActivityTime: now,
    firstReferrer: referrer || 'direct',
    events: {
      pageViews: 1,
    },
  };

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  return sessionData;
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string): void {
  if (typeof window === 'undefined') return;

  const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionData) return;

  const data: SessionData = JSON.parse(sessionData);
  data.events[eventName] = (data.events[eventName] || 0) + 1;
  data.lastActivityTime = new Date().toISOString();

  sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Check if this is a new session (first page view)
 */
export function isNewSession(sessionData: SessionData): boolean {
  return sessionData.pageViewCount === 1;
}
