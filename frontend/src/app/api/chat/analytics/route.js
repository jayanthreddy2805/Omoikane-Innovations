import { NextResponse } from 'next/server';
import { queryAnalyticsService } from '@/services/queryAnalyticsService';

/**
 * Endpoint for leadership or admin to review chatbot query trends
 * GET /api/chat/analytics
 */
export async function GET() {
  const summary = queryAnalyticsService.getAnalyticsSummary();
  const recentLogs = queryAnalyticsService.getRecentLogs(30);

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    metrics: summary,
    recentQueries: recentLogs
  });
}
