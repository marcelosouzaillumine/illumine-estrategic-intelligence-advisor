import { CommercialPilotSessionManager } from './CommercialPilotSessionManager';
import { PilotFeedbackEngine } from './PilotFeedbackEngine';

export class PilotExperienceMetrics {
  private static exportCounts: Record<string, number> = {};
  private static timeToInsightLogs: Record<string, number[]> = {};
  private static onboardingTimes: Record<string, number[]> = {};

  /**
   * Clears metrics for testing.
   */
  public static clearForTest(): void {
    this.exportCounts = {};
    this.timeToInsightLogs = {};
    this.onboardingTimes = {};
  }

  /**
   * Logs an export operation.
   */
  public static logExport(tenantId: string): void {
    if (!tenantId) return;
    this.exportCounts[tenantId] = (this.exportCounts[tenantId] || 0) + 1;
  }

  /**
   * Logs a time-to-insight duration.
   */
  public static logTimeToInsight(tenantId: string, seconds: number): void {
    if (!tenantId) return;
    if (!this.timeToInsightLogs[tenantId]) {
      this.timeToInsightLogs[tenantId] = [];
    }
    this.timeToInsightLogs[tenantId].push(seconds);
  }

  /**
   * Logs an onboarding duration.
   */
  public static logOnboardingTime(tenantId: string, seconds: number): void {
    if (!tenantId) return;
    if (!this.onboardingTimes[tenantId]) {
      this.onboardingTimes[tenantId] = [];
    }
    this.onboardingTimes[tenantId].push(seconds);
  }

  /**
   * Calculates pilot operational-only metrics.
   * Prohibited: score, risk, severity, recommendations, causality.
   */
  public static calculate(tenantId: string): {
    averageTimeToInsightSeconds: number;
    averageOnboardingTimeSeconds: number;
    usageRateCount: number;
    exportFrequencyCount: number;
    averageWarningDensity: number;
    averageSessionEngagementMinutes: number;
  } {
    if (!tenantId || tenantId.trim() === '') {
      throw new Error('[Pilot Metrics] tenantId é obrigatório para cálculo de métricas.');
    }

    // 1. Time to insight
    const insights = this.timeToInsightLogs[tenantId] || [];
    const avgInsight = insights.length > 0 
      ? insights.reduce((sum, val) => sum + val, 0) / insights.length 
      : 45.0; // default benchmark value

    // 2. Onboarding time
    const onboardings = this.onboardingTimes[tenantId] || [];
    const avgOnboarding = onboardings.length > 0 
      ? onboardings.reduce((sum, val) => sum + val, 0) / onboardings.length 
      : 120.0; // default benchmark value

    // 3. Usage Rate Count (Total sessions registered)
    const totalSessions = CommercialPilotSessionManager.getAllSessions(tenantId).length;

    // 4. Export Frequency Count
    const exports = this.exportCounts[tenantId] || 0;

    // 5. Warning density (from client feedbacks logs or default baseline)
    const feedbacks = PilotFeedbackEngine.getFeedbackByTenant(tenantId);
    const avgWarningDensity = feedbacks.length > 0 
      ? feedbacks.reduce((sum, f) => sum + f.irrelevantWarnings, 0) / feedbacks.length 
      : 1.5;

    // 6. Session engagement (average duration in minutes of completed sessions)
    const completedSessions = CommercialPilotSessionManager.getCompletedSessions(tenantId);
    let avgEngagement = 15.0; // default baseline in minutes
    if (completedSessions.length > 0) {
      const totalDurationsMs = completedSessions.reduce((sum, s) => {
        if (s.endedAt) {
          return sum + (new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime());
        }
        return sum;
      }, 0);
      avgEngagement = (totalDurationsMs / completedSessions.length) / 60000;
    }

    return {
      averageTimeToInsightSeconds: Number(avgInsight.toFixed(1)),
      averageOnboardingTimeSeconds: Number(avgOnboarding.toFixed(1)),
      usageRateCount: totalSessions,
      exportFrequencyCount: exports,
      averageWarningDensity: Number(avgWarningDensity.toFixed(1)),
      averageSessionEngagementMinutes: Number(avgEngagement.toFixed(1))
    };
  }
}
