/**
 * ============================================================================
 * CHATBOT TELEMETRY & QUERY LOGGING SERVICE - Omoikane Innovations
 * ============================================================================
 * Lightweight, privacy-respecting query telemetry for leadership analytics:
 * - Logs anonymous question topics and timestamps
 * - Tracks unanswered / off-topic queries to identify missing documentation
 * - Stores locally in memory & app storage with zero external dependencies
 * ============================================================================
 */

const MAX_LOG_ENTRIES = 200;
let inMemoryLogs = [];

export const queryAnalyticsService = {
  /**
   * Log an incoming visitor question and the resolution status
   */
  logQuery({ query, hasVerifiedEvidence, responseSource, isFallback = false, isUnanswered = false }) {
    if (!query || typeof query !== 'string') return;

    const trimmed = query.trim().slice(0, 300);
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      query: trimmed,
      hasVerifiedEvidence: !!hasVerifiedEvidence,
      source: responseSource || 'General Knowledge',
      status: isUnanswered ? 'UNANSWERED' : (isFallback ? 'SAFE_FALLBACK' : 'ANSWERED_VERIFIED'),
      category: categorizeQuery(trimmed)
    };

    inMemoryLogs.unshift(entry);
    if (inMemoryLogs.length > MAX_LOG_ENTRIES) {
      inMemoryLogs = inMemoryLogs.slice(0, MAX_LOG_ENTRIES);
    }

    // In development or server environment, emit concise audit line for monitoring
    if (process.env.NODE_ENV !== 'production' || isUnanswered) {
      console.log(`[Chatbot Analytics] [${entry.status}] [${entry.category}]: "${trimmed}"`);
    }

    return entry;
  },

  /**
   * Returns aggregated query metrics for leadership review
   */
  getAnalyticsSummary() {
    const total = inMemoryLogs.length;
    const verified = inMemoryLogs.filter(l => l.status === 'ANSWERED_VERIFIED').length;
    const unanswered = inMemoryLogs.filter(l => l.status === 'UNANSWERED' || l.status === 'SAFE_FALLBACK').length;

    // Category breakdown
    const categoryCounts = {};
    for (const log of inMemoryLogs) {
      categoryCounts[log.category] = (categoryCounts[log.category] || 0) + 1;
    }

    return {
      totalQueries: total,
      verifiedAnswerRate: total > 0 ? `${Math.round((verified / total) * 100)}%` : '100%',
      unansweredCount: unanswered,
      topCategories: categoryCounts,
      recentUnanswered: inMemoryLogs
        .filter(l => l.status === 'UNANSWERED' || l.status === 'SAFE_FALLBACK')
        .slice(0, 10)
        .map(l => ({ query: l.query, timestamp: l.timestamp }))
    };
  },

  /**
   * Get raw recent logs
   */
  getRecentLogs(limit = 50) {
    return inMemoryLogs.slice(0, limit);
  }
};

function categorizeQuery(q) {
  const query = q.toLowerCase();
  if (query.includes('ofc') || query.includes('flight controller')) return 'Product: OFC-X';
  if (query.includes('oesc') || query.includes('speed controller')) return 'Product: OESC';
  if (query.includes('ogn') || query.includes('gps') || query.includes('gnss')) return 'Product: OGN-X';
  if (query.includes('ocom') || query.includes('communication') || query.includes('telemetry')) return 'Product: OCOM-X';
  if (query.includes('career') || query.includes('job') || query.includes('hiring') || query.includes('internship') || query.includes('resume')) return 'Careers & Hiring';
  if (query.includes('address') || query.includes('location') || query.includes('phone') || query.includes('email') || query.includes('contact')) return 'Contact & Location';
  if (query.includes('aerospace') || query.includes('defense') || query.includes('uav')) return 'Domains & Capabilities';
  return 'General Inquiry';
}
