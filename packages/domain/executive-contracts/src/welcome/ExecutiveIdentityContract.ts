export interface ExecutiveIdentityContract {
  readonly identityId: string;
  readonly leadershipJourneyStage: string;
  readonly monthsInJourney: number;
  readonly financialCycleDaysReduced: number;
  readonly totalDecisionsConductedCount: number;
  readonly totalOrganizationsImpactedCount: number;
  readonly totalStrategicMissionsCompletedCount: number;
  readonly leadershipMilestones: readonly string[];
  readonly currentExecutiveMomentum: 'LOW' | 'MODERATE' | 'HIGH' | 'EXCELLENT';
  readonly executiveEvolutionScore: number; // 0 to 100
  readonly legacyNarrativeText: string;
}
