import type { GovernanceMemory } from "./governance-memory-types";

export interface GovernancePattern {
  topic: string;
  occurrences: number;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface GovernanceFriction {
  topic: string;
  recurrenceCount: number;
  unresolvedCycles: number;
}

export interface PersistentRisk {
  riskTopic: string;
  recurrenceCount: number;
}

export interface DecisionEffectiveness {
  decisionsCreated: number;
  actionsCreated: number;
  actionsCompleted: number;
  effectivenessRatio: number;
}

export interface InstitutionalMomentum {
  decisionsTaken: number;
  decisionsExecuted: number;
  momentumRatio: number;
}

export interface GovernanceIntelligenceNetwork {
  recurringTopics: GovernancePattern[];
  governanceFrictions: GovernanceFriction[];
  persistentRisks: PersistentRisk[];
  decisionEffectiveness: DecisionEffectiveness;
  institutionalMomentum: InstitutionalMomentum;
  institutionalLearnings: string[];
  fiduciaryDisclaimer: string;
}

export interface GovernanceIntelligenceInput {
  governanceMemory?: GovernanceMemory;
}

export interface GovernanceIntelligenceReportLike {
  governanceMemory?: GovernanceMemory;
}
