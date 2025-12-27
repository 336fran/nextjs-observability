import { NextRequest, NextResponse } from 'next/server';
import {
  recordSessionCreated,
  recordPageView,
  recordSessionDuration,
} from '@/app/lib/metrics';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { pathname, userAgent, referrer, timestamp, sessionData, isNewSession } = data;

    // Extract client IP from request headers
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                     request.headers.get('cf-connecting-ip') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Record metrics
    if (isNewSession) {
      // Record new session creation
      recordSessionCreated(pathname, sessionData.firstReferrer);
      console.log(
        `[PAGE_VIEW_API] NEW SESSION | Session: ${sessionData.sessionId} | IP: ${clientIp} | First Page: ${pathname} | Referrer: ${sessionData.firstReferrer} | ${timestamp}`
      );
    } else {
      // Record session duration since session started
      const sessionStartTime = new Date(sessionData.sessionStartTime);
      const currentTime = new Date(timestamp);
      const durationSeconds = (currentTime.getTime() - sessionStartTime.getTime()) / 1000;
      recordSessionDuration(durationSeconds, sessionData.firstPage, sessionData.firstReferrer);
    }

    // Record page view for every page visit
    recordPageView(pathname, sessionData.firstReferrer);

    // Log page view
    console.log(
      `[PAGE_VIEW_API] ${pathname} | Session: ${sessionData.sessionId} | Page Views: ${sessionData.pageViewCount} | IP: ${clientIp} | User-Agent: ${userAgent} | ${timestamp}`
    );

    return NextResponse.json(
      { success: true, message: 'Page view tracked' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[PAGE_VIEW_API_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process page view' },
      { status: 400 }
    );
  }
}
