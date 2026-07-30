import { ExecutiveBriefingContract } from './ExecutiveBriefingContract';
import { ExecutiveMissionContract } from './ExecutiveMissionContract';
import { ExecutiveAttentionContract } from './ExecutiveAttentionContract';
import { ExecutiveTrustContract } from './ExecutiveTrustContract';
import { ExecutivePresenceContract } from './ExecutivePresenceContract';
import { ExecutiveRitualContract } from './ExecutiveRitualContract';
import { ExecutiveMemoryContract } from './ExecutiveMemoryContract';
import { ExecutiveIdentityContract } from './ExecutiveIdentityContract';
import { AdvisorLegacyContract } from './AdvisorLegacyContract';
import { ExecutiveLegacyContract } from './ExecutiveLegacyContract';
import { ExecutiveRelationshipContract } from './ExecutiveRelationshipContract';
import { ExecutiveCelebrationContract } from './ExecutiveCelebrationContract';

export interface ExecutiveWelcomeContract {
  readonly welcomeId: string;
  readonly userId: string;
  readonly role: 'CLIENT' | 'ADVISOR' | 'BOARD' | 'PARTNER' | 'MASTER_ADMIN';
  readonly greetingText: string;
  readonly briefing: ExecutiveBriefingContract;
  readonly mission: ExecutiveMissionContract;
  readonly attention: ExecutiveAttentionContract;
  readonly trust: ExecutiveTrustContract;
  readonly presence?: ExecutivePresenceContract;
  readonly ritual?: ExecutiveRitualContract;
  readonly memory?: ExecutiveMemoryContract;
  readonly identity?: ExecutiveIdentityContract;
  readonly legacy?: ExecutiveLegacyContract;
  readonly relationship?: ExecutiveRelationshipContract;
  readonly celebration?: ExecutiveCelebrationContract;
  readonly advisorLegacy?: AdvisorLegacyContract;
  readonly purposeStatementText: string;
  readonly renewalProbabilityPercent: number; // 98%
  readonly closingActionQuestion: string;
  readonly relationshipHealthScore: number; // 0 to 100
  readonly generatedAt: string;
}

export * from './ExecutiveBriefingContract';
export * from './ExecutiveMissionContract';
export * from './ExecutiveAttentionContract';
export * from './ExecutiveTrustContract';
export * from './ExecutivePresenceContract';
export * from './ExecutiveRitualContract';
export * from './ExecutiveMemoryContract';
export * from './ExecutiveIdentityContract';
export * from './AdvisorLegacyContract';
export * from './ExecutiveLegacyContract';
export * from './ExecutiveRelationshipContract';
export * from './ExecutiveCelebrationContract';
