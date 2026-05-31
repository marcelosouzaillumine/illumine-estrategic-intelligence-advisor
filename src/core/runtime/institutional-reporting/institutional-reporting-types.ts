// src/core/runtime/institutional-reporting/institutional-reporting-types.ts

import { InstitutionalExecutiveCommandOutput, ExecutiveDirective } from '../executive-command/executive-command-types';
import { InstitutionalOperationalGovernanceOutput } from '../operational-governance/operational-governance-types';
import { InstitutionalStrategicIntelligenceOutput } from '../strategic-intelligence/strategic-intelligence-types';
import { InstitutionalResilienceOutput } from '../institutional-resilience/ResilienceTypes';
import { TreasuryIntelligenceRuntimeOutput } from '../treasury-intelligence/types';

export type ReportGenerationStatus = 'COMPLETE' | 'RESTRICTED' | 'FAILED';

export interface ReportGenerationMetadata {
  boardPackLineageHash: string;
  generationTimestamp: string;
  tenantId: string;
  cycleReference: string;
  isImmutableSnapshot: boolean;
  confidenceThresholdMet: boolean;
  historicalCyclesAvailable: number;
}

export interface FiduciaryRestriction {
  restrictionType: 'FAIL_CLOSED' | 'INSUFFICIENT_HISTORY' | 'UNVERIFIABLE_LINEAGE' | 'RESTRICTED_ACCESS';
  description: string;
  affectedRuntimes: string[];
}

export interface InstitutionalDisclosure {
  disclosureId: string;
  statement: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface ExecutiveSnapshotSection {
  executiveSummary: string; // Deterministic semantic sentence
  unifiedThesisStatement: string;
  activeSurvivalMode: boolean;
  structuralPressureLevel: string;
  fiduciaryRestrictionsActive: number;
}

export interface GovernanceReportingSection {
  complianceStatus: string;
  activeGovernanceLocks: string[];
  executionIntegrity: string;
  governanceScore: number;
}

export interface StrategicDirectionSection {
  strategicPosture: string;
  primaryVector: string;
  trajectoryContinuity: string;
  expansionSustainability: boolean;
  strategicContradictions: string[];
}

export interface ContinuitySection {
  resilienceStatus: string;
  antifragilityScore: number;
  survivalOverlays: string[];
}

export interface TreasurySection {
  treasuryStressStatus: string;
  liquidityCompressionLevel: string;
  fundingFragility: string;
  runwaySustainability: boolean;
}

export interface OperationalGovernanceSection {
  executionStatus: string;
  operationalFrictions: string[];
  continuityStrain: string;
}

export interface ExecutiveDirectiveSection {
  activeDirectives: ExecutiveDirective[];
  boardResolutions: string[]; // Board resolution references
}

export interface ExplainabilityAppendix {
  rationaleMap: Record<string, string>;
  confidenceDecomposition: Record<string, string>;
}

export interface LineageAppendix {
  boardPackLineageHash: string;
  runtimeHashes: Record<string, string>;
  propagationHashes: string[];
}

export interface BoardResolutionAppendix {
  resolutionIds: string[];
  approvals: string[];
  readOnlyHistoricalMemory: boolean;
}

export interface InstitutionalBoardPackOutput {
  status: ReportGenerationStatus;
  metadata: ReportGenerationMetadata;
  executiveSnapshot: ExecutiveSnapshotSection;
  governanceReport: GovernanceReportingSection;
  strategicDirection: StrategicDirectionSection;
  continuityReport: ContinuitySection;
  treasuryReport: TreasurySection;
  operationalGovernance: OperationalGovernanceSection;
  executiveDirectives: ExecutiveDirectiveSection;
  explainabilityAppendix: ExplainabilityAppendix;
  lineageAppendix: LineageAppendix;
  boardResolutionAppendix: BoardResolutionAppendix;
  disclosures: InstitutionalDisclosure[];
  fiduciaryRestrictions: FiduciaryRestriction[];
}
