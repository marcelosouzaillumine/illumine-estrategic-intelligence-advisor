import type { UnifiedFinancialNarrative } from "./unified-financial-narrative-types";
import type { ExecutiveFinancialStory } from "./executive-financial-story-types";
import type { GovernanceIntelligenceNetwork } from "./governance-intelligence-network-types";
import type { GovernanceDigitalTwin } from "./governance-digital-twin-types";
import type { ESGIntelligence } from "./esg-intelligence-types";
import type { GovernanceMemory } from "./governance-memory-types";

export type ValuationReadinessClassification =
  | "HIGH"
  | "MODERATE"
  | "LOW";

export interface ValuationImpactSignal {
  source:
    | "FINANCIAL"
    | "GOVERNANCE"
    | "ESG"
    | "EXECUTION"
    | "MEMORY";
  signal: string;
}

export interface ValuationRiskSignal {
  source:
    | "FINANCIAL"
    | "GOVERNANCE"
    | "ESG"
    | "EXECUTION"
    | "MEMORY";
  risk: string;
}

export interface ValuationIntelligenceInput {
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
  executiveFinancialStory?: ExecutiveFinancialStory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  governanceMemory?: GovernanceMemory;
}

export interface ValuationIntelligenceReportLike {
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
  executiveFinancialStory?: ExecutiveFinancialStory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  governanceMemory?: GovernanceMemory;
}

export interface ValuationIntelligence {
  valuationReadiness: ValuationReadinessClassification;
  valueCreationSignals: ValuationImpactSignal[];
  valueDestructionRisks: ValuationRiskSignal[];
  governanceValuationImpact: string;
  esgValuationImpact: string;
  executionValuationImpact: string;
  memoryValuationImpact: string;
  valuationNarrative: string;
  valuationAttentionPoints: string[];
  fiduciaryDisclaimer: string;
}
