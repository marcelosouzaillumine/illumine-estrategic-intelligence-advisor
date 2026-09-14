import type { GovernanceMemory } from "./governance-memory-types";
import type { GovernanceIntelligenceNetwork } from "./governance-intelligence-network-types";
import type { GovernanceDigitalTwin } from "./governance-digital-twin-types";

export interface ESGDimensionAssessment {
  score: number;
  classification: "HIGH" | "MODERATE" | "LOW";
  strengths: string[];
  opportunities: string[];
}

export interface ESGIntelligence {
  environmental: ESGDimensionAssessment;
  social: ESGDimensionAssessment;
  governance: ESGDimensionAssessment;
  overallScore: number;
  institutionalHighlights: string[];
  institutionalWarnings: string[];
  fiduciaryDisclaimer: string;
}

export interface ESGIntelligenceInput {
  governanceMemory?: GovernanceMemory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
}

export interface ESGIntelligenceReportLike {
  governanceMemory?: GovernanceMemory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
  governanceDigitalTwin?: GovernanceDigitalTwin;
}
