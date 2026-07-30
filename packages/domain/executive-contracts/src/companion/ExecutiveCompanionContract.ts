import { ExecutiveTimelineContract } from './ExecutiveTimelineContract';
import { OrganizationalMomentumContract } from './OrganizationalMomentumContract';
import { OrganizationalAchievementContract } from './OrganizationalAchievementContract';
import { ExecutiveWisdomContract } from './ExecutiveWisdomContract';

export interface ExecutiveCompanionContract {
  readonly companionId: string;
  readonly userId: string;
  readonly role: 'CLIENT' | 'ADVISOR' | 'BOARD' | 'PARTNER' | 'MASTER_ADMIN';
  readonly executiveProfileName: string;
  readonly leadershipEvolutionStage: string;
  readonly executiveStyle: string;
  readonly decisionPatternSummary: string;
  readonly strategicFocusText: string;
  readonly confidenceTrend: 'HIGH' | 'STABLE' | 'EVOLVING';
  readonly leadershipGrowthScore: number; // 0 to 100
  readonly currentChallenges: readonly string[];
  readonly currentStrengths: readonly string[];
  readonly relationshipContextText: string;
  readonly currentMomentumLevel: 'CRITICAL' | 'SLOW' | 'STABLE' | 'STRONG' | 'EXCEPTIONAL';
  readonly timeline?: ExecutiveTimelineContract;
  readonly momentum?: OrganizationalMomentumContract;
  readonly achievements?: readonly OrganizationalAchievementContract[];
  readonly wisdom?: readonly ExecutiveWisdomContract[];
  readonly generatedAt: string;
}

export * from './ExecutiveTimelineContract';
export * from './OrganizationalMomentumContract';
export * from './OrganizationalAchievementContract';
export * from './ExecutiveWisdomContract';

