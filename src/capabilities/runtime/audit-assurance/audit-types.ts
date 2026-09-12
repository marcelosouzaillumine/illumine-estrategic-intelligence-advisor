// src/core/runtime/audit-assurance/audit-types.ts
//
// Sovereign Institutional Audit, Evidence & Regulatory Assurance Types

export type AssuranceClassification =
  | 'AUDIT_READY'
  | 'DISCLOSURE_LIMITED'
  | 'TRACEABILITY_RESTRICTED'
  | 'ASSURANCE_DEGRADED'
  | 'NON_REPRODUCIBLE'
  | 'FAIL_CLOSED';

export type FiduciaryAssuranceGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface EvidencePackage {
  sourceReferences: string[];
  causalDependencies: string[];
  calculationLineage: string[];
  runtimeAssumptions: string[];
  confidenceDerivation: string[];
  severityPropagation: string[];
  decisionDependencies: string[];
  simulationAssumptions: string[];
  treasuryDependencies: string[];
  survivabilityDependencies: string[];
  timestamp: string;
  signature?: string;
}

export interface AuditTrailEntry {
  timestamp: string;
  runtimeSource: string;
  severityState: string;
  lineageHashes: string[];
  confidenceState: string;
  failClosedPropagation: boolean;
  certificationState: string;
}

export interface AssuranceMetadata {
  auditId: string;
  classification: AssuranceClassification;
  grade: FiduciaryAssuranceGrade;
  scores: {
    auditabilityScore: number;            // 0-100
    explainabilityScore: number;          // 0-100
    evidenceIntegrityScore: number;       // 0-100
    lineageReproducibilityScore: number;  // 0-100
    regulatoryReadinessScore: number;     // 0-100
    overallScore: number;                 // 0-100
  };
  evidencePackage: EvidencePackage;
  auditTrail: AuditTrailEntry[];
  causalChainTrace: string[];
  explainabilityNarrative: {
    decisionBlockReason?: string;
    severityEscalationReason?: string;
    survivabilityDegradationReason?: string;
    treasuryPropagationReason?: string;
    predictiveRuptureReason?: string;
    publicationRestrictionReason?: string;
  };
  reconstructionVerified: boolean;
  lineageHash: string;
  correlationId: string;
  timestamp: string;
}
