// src/core/runtime/shared/runtime-contracts.ts

import { FailClosedState } from './fail-closed-types';
import { LineageHash } from './lineage-types';
import { 
  InstitutionalSeverityScale, 
  RuntimeIntegrityStatus, 
  ExplainabilityLevel,
  GovernanceComplianceStatus 
} from './runtime-constitutional-types';

export interface RuntimeMetadata {
  generatedAt: string;
  runtimeVersion: string;
  contractVersion: 'RC_1_13A' | string;
  tenantId: string;
  cycleReference: string;
  failClosedState?: FailClosedState;
}

export interface RuntimeConfidenceProfile {
  confidenceScore: number; // 0 to 100
  confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'UNVERIFIABLE';
  confidenceDegradationFactors: string[];
}

export interface RuntimeComplianceProfile {
  integrityStatus: RuntimeIntegrityStatus;
  complianceStatus: GovernanceComplianceStatus;
  complianceBlockers: string[];
}

export type RuntimeSeverity = InstitutionalSeverityScale;

export type RuntimeStatus = 'COMPLETE' | 'RESTRICTED' | 'FAILED' | 'PARTIAL';

export interface InstitutionalDisclosure {
  disclosureId: string;
  disclosureType: 'LIMITATION' | 'RESTRICTION' | 'ASSUMPTION' | 'DEGRADATION';
  severity: RuntimeSeverity;
  sourceRuntime: string;
  restrictionLevel: 'NONE' | 'SOFT' | 'HARD';
  message: string;
}

export interface RuntimeAuditTrail {
  events: {
    timestamp: string;
    action: string;
    engine: string;
    hashRef: string;
  }[];
}

export interface HistoricalContinuityMetadata {
  historicalCyclesAnalyzed: number;
  continuityBreaks: number;
  oldestCycleReference: string;
}

export interface ExplainabilityOutput {
  structuralDrivers: string[];
  propagationChains: string[];
  evidence: string[];
  confidenceDecomposition: Record<string, string>;
  lineageReferences: string[];
  level: ExplainabilityLevel;
}

export interface RuntimeOutputBase {
  runtimeMetadata: RuntimeMetadata;
  lineage: {
    lineageHash: LineageHash;
    parentHashes: LineageHash[];
  };
  disclosures: InstitutionalDisclosure[];
  compliance: RuntimeComplianceProfile;
  explainability: ExplainabilityOutput;
  failClosedState?: FailClosedState;
  historicalContinuityMetadata?: HistoricalContinuityMetadata;
}
