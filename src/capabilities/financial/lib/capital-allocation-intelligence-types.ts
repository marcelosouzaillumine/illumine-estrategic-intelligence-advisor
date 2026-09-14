import type { SectorIntelligence } from './sector-intelligence-types';
import type { BenchmarkIntelligence } from './benchmark-intelligence-types';
import type { ValuationIntelligence } from './valuation-intelligence-types';
import type { ESGIntelligence } from './esg-intelligence-types';
import type { GovernanceDigitalTwin } from './governance-digital-twin-types';

export interface CapitalAllocationIntelligenceInput {
  sectorIntelligence?: SectorIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  esgIntelligence?: ESGIntelligence;
  governanceDigitalTwin?: GovernanceDigitalTwin;
}

export interface CapitalAllocationIntelligenceReportLike {
  sectorIntelligence?: SectorIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  esgIntelligence?: ESGIntelligence;
  governanceDigitalTwin?: GovernanceDigitalTwin;
}

export interface CapitalAllocationIntelligence {
  strategicInvestmentPriorities: string[];
  capabilityInvestmentPriorities: string[];
  governanceInvestmentPriorities: string[];
  executionAccelerationPriorities: string[];
  valueProtectionPriorities: string[];
  valueCreationPriorities: string[];
  fiduciaryDisclaimer: string;
}
