import { ExecutiveWelcomeContract } from '@illumine/executive-contracts';
import { ExecutiveGreetingEngine } from './ExecutiveGreetingEngine';
import { ExecutiveBriefingEngine } from './ExecutiveBriefingEngine';
import { ExecutiveMissionEngine } from './ExecutiveMissionEngine';
import { ExecutiveAttentionEngine } from './ExecutiveAttentionEngine';
import { ExecutiveTrustEngine } from './ExecutiveTrustEngine';
import { ExecutiveContextIntelligenceEngine } from './ExecutiveContextIntelligenceEngine';
import { ExecutivePresenceScoreEngine } from './ExecutivePresenceScoreEngine';
import { ExecutiveMemoryEngine } from './ExecutiveMemoryEngine';
import { ExecutiveRitualEngine } from './ExecutiveRitualEngine';
import { ExecutiveClosingQuestionEngine } from './ExecutiveClosingQuestionEngine';
import { ExecutiveIdentityEngine } from './ExecutiveIdentityEngine';
import { AdvisorLegacyEngine } from './AdvisorLegacyEngine';
import { ExecutiveRelationshipScoreEngine } from './ExecutiveRelationshipScoreEngine';
import { ExecutiveLegacyEngine } from './ExecutiveLegacyEngine';
import { ExecutiveRelationshipEngine } from './ExecutiveRelationshipEngine';
import { ExecutiveCelebrationEngine } from './ExecutiveCelebrationEngine';
import { ExecutivePurposeEngine } from './ExecutivePurposeEngine';

export class ExecutiveWelcomeOrchestrator {
  public static buildWelcomeExperience(
    userId: string,
    userName: string,
    role: 'CLIENT' | 'ADVISOR' | 'BOARD' | 'PARTNER' | 'MASTER_ADMIN' = 'CLIENT',
    companyId: string = 'empresa-demo',
    daysSinceLastAccess: number = 0,
    isRealDataAvailable: boolean = false
  ): ExecutiveWelcomeContract {
    const greetingText = ExecutiveGreetingEngine.generateGreeting(userName);
    const briefing = ExecutiveBriefingEngine.generateBriefing(role);
    const mission = ExecutiveMissionEngine.generateMission(role);
    const attention = ExecutiveAttentionEngine.calculateExecutiveAttention();
    const trust = ExecutiveTrustEngine.measureTrust(companyId);

    const presence = ExecutiveContextIntelligenceEngine.resolveContext(daysSinceLastAccess);
    const ritual = ExecutiveRitualEngine.buildRitual(role);
    const memory = ExecutiveMemoryEngine.recallPreviousContext();
    const identity = ExecutiveIdentityEngine.buildIdentityNarrative(userName);
    const legacy = ExecutiveLegacyEngine.calculateExecutiveLegacy(isRealDataAvailable);
    const relationship = ExecutiveRelationshipEngine.evaluateRelationship();
    const celebration = ExecutiveCelebrationEngine.detectCelebrations();
    const advisorLegacy = AdvisorLegacyEngine.buildAdvisorLegacy(userName);
    const purposeStatementText = ExecutivePurposeEngine.buildPurposeStatement();
    const closingActionQuestion = ExecutiveClosingQuestionEngine.generateClosingQuestion(role);
    const relationshipHealthScore = ExecutivePresenceScoreEngine.calculateRelationshipHealth(companyId);
    const renewalProbabilityPercent = ExecutiveRelationshipScoreEngine.calculateCommercialRenewalProbability(companyId);

    return {
      welcomeId: `wlc-${userId}-${Date.now()}`,
      userId,
      role,
      greetingText,
      briefing,
      mission,
      attention,
      trust,
      presence,
      ritual,
      memory,
      identity,
      legacy,
      relationship,
      celebration,
      advisorLegacy,
      purposeStatementText,
      renewalProbabilityPercent,
      closingActionQuestion,
      relationshipHealthScore,
      generatedAt: new Date().toISOString()
    };
  }
}
