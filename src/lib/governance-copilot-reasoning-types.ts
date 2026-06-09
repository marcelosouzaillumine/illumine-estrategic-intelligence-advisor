// src/lib/governance-copilot-reasoning-types.ts

import type { GovernanceCopilotContext, GovernanceCopilotTopic } from './governance-copilot-types';
import type { GovernanceMemory } from './governance-memory-types';
import type { GovernanceIntelligenceNetwork } from './governance-intelligence-network-types';
import type { GovernanceDigitalTwin } from './governance-digital-twin-types';
import type { ESGIntelligence } from './esg-intelligence-types';
import type { ValuationIntelligence } from './valuation-intelligence-types';
import type { BenchmarkIntelligence } from './benchmark-intelligence-types';
import type { SectorIntelligence } from './sector-intelligence-types';
import type { CapitalAllocationIntelligence } from './capital-allocation-intelligence-types';
import type { ExecutiveSovereigntyProfile } from './executive-sovereignty-types';

export interface GovernanceCopilotQuestion {
  questionId: string;
  text: string;
}

export interface GovernanceCopilotReasoningInput {
  governanceCopilotContext?: GovernanceCopilotContext;
  governanceMemory?: GovernanceMemory;
  governanceIntelligenceNetwork?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  sectorIntelligence?: SectorIntelligence;
  capitalAllocationIntelligence?: CapitalAllocationIntelligence;
  executiveSovereignty?: ExecutiveSovereigntyProfile;
  institutionalOutcomes?: any;
}

export interface GovernanceCopilotEvidenceReference {
  evidenceId: string;
  evidenceType: string;
  sourceLayer: string;
  description: string;
}

export interface GovernanceCopilotMemoryReference {
  memoryId: string;
  sourceLayer: string;
  description: string;
}

export interface GovernanceCopilotConflict {
  conflictId: string;
  description: string;
  severity: 'MODERATE' | 'HIGH' | 'CRITICAL';
  layersInvolved: string[];
}

export type GovernanceCopilotConfidenceLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export interface GovernanceCopilotConfidence {
  level: GovernanceCopilotConfidenceLevel;
  evidenceWeight: number;
  memoryWeight: number;
  intelligenceWeight: number;
  conflictPenalty: number;
}

export interface GovernanceCopilotReasoningResult {
  questionId: string;
  relevantTopics: GovernanceCopilotTopic[];
  requiredSources: string[];
  supportingEvidence: GovernanceCopilotEvidenceReference[];
  supportingMemories: GovernanceCopilotMemoryReference[];
  identifiedConflicts: GovernanceCopilotConflict[];
  confidence: GovernanceCopilotConfidence;
  reasoningClassification: 'INSUFFICIENT_CONTEXT' | 'PARTIAL_CONTEXT' | 'FULL_CONTEXT' | 'CONFLICTING_CONTEXT';
}

export interface GovernanceCopilotReasoningReportLike {
  governanceMemory?: GovernanceMemory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  sectorIntelligence?: SectorIntelligence;
  capitalAllocationIntelligence?: CapitalAllocationIntelligence;
  executiveSovereignty?: ExecutiveSovereigntyProfile;
  institutionalOutcomes?: any;
  governanceCopilotContext?: GovernanceCopilotContext;
  governanceCopilotReasoning?: GovernanceCopilotReasoningResult;
}
