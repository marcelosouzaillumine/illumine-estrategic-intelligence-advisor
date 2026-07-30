export interface OrganizationalAchievementContract {
  readonly achievementId: string;
  readonly title: string;
  readonly description: string;
  readonly impactSummary: string;
  readonly achievedDateIso: string;
  readonly valueCreatedFormatted: string;
  readonly category: 'GOVERNANCE' | 'FINANCIAL' | 'OPERATIONAL' | 'EXPANSION' | 'COMPLIANCE';
  readonly suggestedNextAchievement: string;
  readonly isSimulatedBenchmark: boolean;
}
