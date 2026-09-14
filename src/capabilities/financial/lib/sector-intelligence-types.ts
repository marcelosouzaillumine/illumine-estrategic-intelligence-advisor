import type { ESGIntelligence } from './esg-intelligence-types';
import type { ValuationIntelligence } from './valuation-intelligence-types';
import type { BenchmarkIntelligence } from './benchmark-intelligence-types';
import type { GovernanceDigitalTwin } from './governance-digital-twin-types';

export interface SectorIntelligenceInput {
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  governanceDigitalTwin?: GovernanceDigitalTwin;
}

export interface SectorIntelligenceReportLike {
  esgIntelligence?: ESGIntelligence;
  valuationIntelligence?: ValuationIntelligence;
  benchmarkIntelligence?: BenchmarkIntelligence;
  governanceDigitalTwin?: GovernanceDigitalTwin;
}

export interface SectorIntelligence {
  sectorRiskProfile: string[];
  sectorOpportunityProfile: string[];
  sectorStrategicSignals: string[];
  requiredInstitutionalCapabilities: string[];
  capabilityGaps: string[];
  capabilityAdvantages: string[];
  
  // Refinamento CAIL v3.0
  sectorMaturitySignals: string[];
  sectorExecutionRequirements: string[];
  sectorGovernanceRequirements: string[];

  fiduciaryDisclaimer: string;
}
