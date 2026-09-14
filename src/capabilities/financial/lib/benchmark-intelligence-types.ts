import type { GovernanceMemory } from "./governance-memory-types";
import type { GovernanceIntelligenceNetwork } from "./governance-intelligence-network-types";
import type { GovernanceDigitalTwin } from "./governance-digital-twin-types";
import type { ESGIntelligence } from "./esg-intelligence-types";
import type { ValuationIntelligence } from "./valuation-intelligence-types";
import type { UnifiedFinancialNarrative } from "./unified-financial-narrative-types";

export type BenchmarkPosition =
  | "LEADING"
  | "ADVANCED"
  | "DEVELOPING"
  | "EARLY";

export interface BenchmarkGap {
  category: string;
  description: string;
}

export interface CompetitiveAdvantage {
  category: string;
  advantage: string;
}

export interface BenchmarkIntelligenceInput {
  governanceMemory?: GovernanceMemory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
}

export interface BenchmarkIntelligenceReportLike {
  governanceMemory?: GovernanceMemory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
}

export interface BenchmarkIntelligence {
  institutionalPosition: BenchmarkPosition;
  governancePosition: BenchmarkPosition;
  executionPosition: BenchmarkPosition;
  valuationPosition: BenchmarkPosition;
  esgPosition: BenchmarkPosition;
  institutionalGaps: BenchmarkGap[];
  competitiveAdvantages: CompetitiveAdvantage[];
  benchmarkNarrative: string;
  benchmarkAttentionPoints: string[];
  fiduciaryDisclaimer: string;
}
