import type { SectorIntelligence } from './sector-intelligence-types';
import type { BenchmarkIntelligence } from './benchmark-intelligence-types';
import type { ValuationIntelligence } from './valuation-intelligence-types';
import type { ESGIntelligence } from './esg-intelligence-types';
import type { GovernanceDigitalTwin } from './governance-digital-twin-types';
import type { CapitalAllocationIntelligence } from './capital-allocation-intelligence-types';

export interface ExecutiveSovereigntyInput {
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  sectorIntelligence?: SectorIntelligence;
  capitalAllocationIntelligence?: CapitalAllocationIntelligence;
}

export interface ExecutiveSovereigntyReportLike {
  governanceDigitalTwin?: GovernanceDigitalTwin;
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  sectorIntelligence?: SectorIntelligence;
  capitalAllocationIntelligence?: CapitalAllocationIntelligence;
}

export interface ExecutiveSovereigntyProfile {
  sovereigntyClassification:
    | "FOUNDATIONAL"
    | "DEVELOPING"
    | "ADVANCED"
    | "SOVEREIGN";
  sovereigntyStrengths: string[];
  sovereigntyConstraints: string[];
  sovereigntyDependencies: string[];
  sovereigntyRisks: string[];
  sovereigntyOpportunities: string[];
  strategicAutonomyAssessment: string;
  governanceResilienceAssessment: string;
  capitalAllocationReadiness: string;
  institutionalReadinessSummary: string;
  fiduciaryDisclaimer: string;
}
