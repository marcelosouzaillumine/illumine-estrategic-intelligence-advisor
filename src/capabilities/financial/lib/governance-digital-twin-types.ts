import type { GovernanceMemory } from "./governance-memory-types";
import type { GovernanceIntelligenceNetwork } from "./governance-intelligence-network-types";

export interface InstitutionalTrajectory {
  scenario: string;
  description: string;
}

export interface GovernanceExecutionCapacity {
  executionRatio: number;
  classification: "HIGH" | "MODERATE" | "LOW";
}

export interface GovernanceDigitalTwin {
  currentTrajectory: InstitutionalTrajectory;
  executionTrajectory: InstitutionalTrajectory;
  riskTrajectory: InstitutionalTrajectory;
  governanceTrajectory: InstitutionalTrajectory;
  executionCapacity: GovernanceExecutionCapacity;
  institutionalWarnings: string[];
  institutionalOpportunities: string[];
  fiduciaryDisclaimer: string;
}

export interface GovernanceDigitalTwinInput {
  governanceMemory?: GovernanceMemory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
}

export interface GovernanceDigitalTwinReportLike {
  governanceMemory?: GovernanceMemory;
  governanceIntelligence?: GovernanceIntelligenceNetwork;
}
