// src/core/runtime/institutional-reporting/institutional-reporting-types.ts

import { InstitutionalExecutiveCommandOutput, ExecutiveDirective } from '../executive-command/executive-command-types';
import { InstitutionalOperationalGovernanceOutput } from '../operational-governance/operational-governance-types';
import { InstitutionalStrategicIntelligenceOutput } from '../strategic-intelligence/strategic-intelligence-types';
import { InstitutionalResilienceOutput } from '../institutional-resilience/ResilienceTypes';
import { TreasuryIntelligenceRuntimeOutput } from '../treasury-intelligence/types';
import { RuntimeMetadata, InstitutionalDisclosure } from '../shared/runtime-contracts';
import { BoardPackLineageHash, RuntimeLineageHash } from '../shared/lineage-types';
import { RuntimeIntegrityStatus } from '../shared/runtime-constitutional-types';
import {
  ConstitutionalOverrideAttempt,
  ConstitutionalAuditRecord,
  ConstitutionalIntegrityState
} from '../constitutional-governance/constitutional-types';


export type ReportGenerationStatus = 'COMPLETE' | 'RESTRICTED' | 'FAILED' | 'CONSTITUTIONAL_QUARANTINE';

export interface ConstitutionalSection {
  constitutionalStatus: ConstitutionalIntegrityState;
  doctrineIntegrity: boolean;
  overrideAttempts: ConstitutionalOverrideAttempt[];
  compatibilityStatus: Record<string, boolean>;
  constitutionalConfidence: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';
  erosionSignals: string[];
  migrationSafety: boolean;
  constitutionalRestrictions: string[];
  constitutionalLineageHash: string;
  constitutionalAuditTrail: ConstitutionalAuditRecord[];
  enforcementActions: string[];
  quarantineReason: string;
  affectedRuntimeDomains: string[];
}


export interface BoardPackMetadata extends RuntimeMetadata {
  boardPackLineageHash: BoardPackLineageHash;
  reportGenerationTimestamp: string;
  tenantId: string;
  cycleReference: string;
  snapshotIntegrityStatus: RuntimeIntegrityStatus;
  immutabilityStatus: 'IMMUTABLE' | 'MUTABLE';
  runtimeSources: string[];
}

export interface FiduciaryRestriction {
  restrictionType: 'FAIL_CLOSED' | 'INSUFFICIENT_HISTORY' | 'UNVERIFIABLE_LINEAGE' | 'RESTRICTED_ACCESS';
  description: string;
  affectedRuntimes: string[];
}

export interface ExecutiveSnapshotSection {
  executiveSummary: string; // Deterministic semantic sentence
  unifiedThesisStatement: string;
  activeSurvivalMode: boolean;
  structuralPressureLevel: string;
  fiduciaryRestrictionsActive: number;
  periodScore?: number;
  
  // Novas propriedades Longitudinais
  longitudinalTrajectory?: string;
  longitudinalExecutiveNarrative?: string;
  longitudinalScore?: number | 'NOT_AVAILABLE';
  fiduciaryRestrictions?: FiduciaryRestriction[];
  recoveryNarrativeBlocked?: boolean;
  trajectoryConfidence?: 'HIGH' | 'MODERATE' | 'LOW' | 'BLOCKED';

  // Final Phase: Integration Fields
  stabilityIndexClassification?: string;
  earlyWarningLevel?: string;
  quarantineMode?: boolean;
  isRestricted?: boolean;
  restrictionReason?: string;
  restrictionSeverity?: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'BLOCKED';
  accountingIntegrityStatus?: string;
  timelineIntegrityStatus?: 'VALID' | 'BROKEN' | 'INSUFFICIENT_HISTORY' | 'RESTRICTED';
  continuityRiskLevel?: string;
  lineageHash?: string;
  rationale?: string;
  evidenceTrail?: string[];
}

export interface FiduciaryTimelineSection {
  runwayEvolution: number[];
  burnEvolution: number[];
  fcoEvolution: number[];
  fcfEvolution: number[];
  liquidityQualityEvolution: string[];
  dependencyRecurrence: number;
  artificialLiquidityFrequency: number; // Porcentagem ou contagem
  ebitdaToCashConsistency: boolean;
  trajectoryMarkers: string[];
  periodsCovered: number;
  timelineIntegrityStatus: 'VALID' | 'BROKEN' | 'INSUFFICIENT_HISTORY';
  fiduciaryWarnings: string[];
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
  boardPackLineageHash: BoardPackLineageHash;
  runtimeHashes: Record<string, RuntimeLineageHash>;
  propagationHashes: string[];
}

export interface BoardResolutionAppendix {
  resolutionIds: string[];
  approvals: string[];
  readOnlyHistoricalMemory: boolean;
}

export interface InstitutionalBoardPackOutput {
  status: ReportGenerationStatus;
  metadata: BoardPackMetadata;
  executiveSnapshot: ExecutiveSnapshotSection;
  fiduciaryTimeline?: FiduciaryTimelineSection; // Nova Seção Fiduciária Longitudinal
  governanceReport: GovernanceReportingSection;
  strategicDirection: StrategicDirectionSection;
  continuityReport: ContinuitySection;
  treasuryReport: TreasurySection;
  operationalGovernance: OperationalGovernanceSection;
  executiveDirectives: ExecutiveDirectiveSection;
  explainabilityAppendix: ExplainabilityAppendix;
  lineageAppendix: LineageAppendix;
  boardResolutionAppendix: BoardResolutionAppendix;
  disclosureSet: InstitutionalDisclosure[];
  fiduciaryRestrictions: FiduciaryRestriction[];
  constitutionalSection?: ConstitutionalSection;
}

