export type GovernanceSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type GovernanceStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'BLOCKED' | 'FLAGGED';
export type ConfidenceLevel = 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
export type OriginType = 'INTERNAL' | 'EXTERNAL' | 'REGULATORY' | 'STATUTORY';

export interface EvidenceReference {
  id: string;
  source: string;
  provenanceHash: string;
  collectedAt: string;
  confidenceScore: number;
}

export interface ProvenanceReference {
  lineageHash: string;
  issuerId: string;
  timestamp: string;
  auditVerified: boolean;
}

export interface ConflictProjection {
  id: string;
  conflictId: string;
  director: string;
  role: string;
  type: string;
  partiesInvolved: string[];
  relationship: string;
  financialExposure: string;
  severity: GovernanceSeverity;
  status: GovernanceStatus;
  evidence: EvidenceReference[];
  provenance: ProvenanceReference;
  recommendation: string;
  approvalState: string;
  resolution?: string;
}

export interface DecisionProjection {
  id: string;
  title: string;
  status: GovernanceStatus;
  reason: string;
  hash: string;
  confidenceScore: number;
  lineageStages: {
    stage: string;
    completed: boolean;
    timestamp?: string;
  }[];
}

export interface FiduciaryHealthIndicator {
  score: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  declaredConflictsCount: number;
  monitoredPartiesCount: number;
  blockedDecisionsCount: number;
  pendingDisclosuresCount: number;
}

export interface FiduciaryValidationProjection {
  executiveCaseId: string;
  conflicts: ConflictProjection[];
  decisions: DecisionProjection[];
  evidenceChain: EvidenceReference[];
  provenance: ProvenanceReference;
  fiduciaryHealth: FiduciaryHealthIndicator;
  decisionIntegrityIndex: number;
}
