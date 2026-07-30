import { ExecutiveCompanionContract } from '@illumine/executive-contracts';
import { ExecutiveCompanionEngine } from './ExecutiveCompanionEngine';
import { ExecutiveTimelineEngine } from './ExecutiveTimelineEngine';
import { OrganizationalMomentumEngine } from './OrganizationalMomentumEngine';
import { OrganizationalAchievementEngine } from './OrganizationalAchievementEngine';
import { ExecutiveWisdomEngine } from './ExecutiveWisdomEngine';

export class ExecutiveCompanionOrchestrator {
  public static buildCompanionExperience(
    userId: string,
    userName: string,
    role: 'CLIENT' | 'ADVISOR' | 'BOARD' | 'PARTNER' | 'MASTER_ADMIN' = 'CLIENT',
    companyId: string = 'empresa-demo',
    isRealDataAvailable: boolean = false
  ): ExecutiveCompanionContract {
    const profile = ExecutiveCompanionEngine.resolveCompanionProfile(userName, role);
    const timeline = ExecutiveTimelineEngine.buildTimeline(companyId);
    const momentum = OrganizationalMomentumEngine.calculateMomentum(companyId);
    const achievements = OrganizationalAchievementEngine.detectAchievements(companyId, isRealDataAvailable);
    const wisdom = ExecutiveWisdomEngine.extractWisdom();

    return {
      companionId: `cmp-${userId}-${Date.now()}`,
      userId,
      role,
      executiveProfileName: profile.executiveProfileName,
      leadershipEvolutionStage: profile.leadershipEvolutionStage,
      executiveStyle: profile.executiveStyle,
      decisionPatternSummary: profile.decisionPatternSummary,
      strategicFocusText: profile.strategicFocusText,
      confidenceTrend: profile.confidenceTrend,
      leadershipGrowthScore: profile.leadershipGrowthScore,
      currentChallenges: profile.currentChallenges,
      currentStrengths: profile.currentStrengths,
      relationshipContextText: profile.relationshipContextText,
      currentMomentumLevel: profile.currentMomentumLevel,
      timeline,
      momentum,
      achievements,
      wisdom,
      generatedAt: new Date().toISOString()
    };
  }
}
