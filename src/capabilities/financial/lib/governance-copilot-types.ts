// src/lib/governance-copilot-types.ts

import type { GovernanceMemory } from './governance-memory-types';
import type { GovernanceIntelligenceNetwork } from './governance-intelligence-network-types';
import type { GovernanceDigitalTwin } from './governance-digital-twin-types';
import type { ESGIntelligence } from './esg-intelligence-types';
import type { ValuationIntelligence } from './valuation-intelligence-types';
import type { BenchmarkIntelligence } from './benchmark-intelligence-types';
import type { SectorIntelligence } from './sector-intelligence-types';
import type { CapitalAllocationIntelligence } from './capital-allocation-intelligence-types';
import type { ExecutiveSovereigntyProfile } from './executive-sovereignty-types';

export type GovernanceCopilotTopic =
  | 'RISKS'
  | 'PRIORITIES'
  | 'EXECUTION'
  | 'GOVERNANCE'
  | 'VALUATION'
  | 'ESG'
  | 'CAPITAL_ALLOCATION'
  | 'SOVEREIGNTY'
  | 'OUTCOMES';

export interface GovernanceCopilotEvidence {
  insightId: string;
  evidenceType: string;
  description: string;
  impactScore?: number;
}

export interface GovernanceCopilotContextInput {
  governanceMemory?: GovernanceMemory;
  governanceIntelligenceNetwork?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  sectorIntelligence?: SectorIntelligence;
  capitalAllocationIntelligence?: CapitalAllocationIntelligence;
  executiveSovereignty?: ExecutiveSovereigntyProfile;
  institutionalOutcomes?: any; // To be mapped from IOD payload if needed, or simply passed as is
}

export interface GovernanceCopilotContext {
  availableTopics: GovernanceCopilotTopic[];
  availableEvidence: GovernanceCopilotEvidence[];
  availableMemories: any[]; // Or strongly typed if applicable
  institutionalStrengths: string[];
  institutionalConstraints: string[];
  institutionalDependencies: string[];
  institutionalRisks: string[];
  institutionalOpportunities: string[];
}

export interface GovernanceCopilotReportLike {
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
}
