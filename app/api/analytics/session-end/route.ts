import { NextRequest, NextResponse } from 'next/server';
import {
  recordSessionDuration,
} from '@/app/lib/metrics';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      sessionId,
      sessionStartTime,
      timestamp,
      pageViewCount,
      firstPage,
      lastPage,
      firstReferrer,
    } = data;

    // Calculate session duration
    const startTime = new Date(sessionStartTime);
    const endTime = new Date(timestamp);
    const durationSeconds = (endTime.getTime() - startTime.getTime()) / 1000;

    // Record session duration metric
    recordSessionDuration(durationSeconds, firstPage, firstReferrer);

    console.log(
      `[SESSION_END] Session: ${sessionId} | Duration: ${durationSeconds}s | Pages: ${pageViewCount} | First: ${firstPage} | Last: ${lastPage} | ${timestamp}`
    );

    return NextResponse.json(
      { success: true, message: 'Session ended' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[SESSION_END_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process session end' },
      { status: 400 }
    );
  }
}
