// src/core/runtime/shared/runtime-constitutional-types.ts

export type InstitutionalSeverityScale =
  | 'STABLE'
  | 'MODERATE'
  | 'ELEVATED'
  | 'HIGH'
  | 'CRITICAL'
  | 'RESTRICTED';

export type FiduciarySeverity = 
  | 'NOMINAL'
  | 'MATERIAL'
  | 'SEVERE'
  | 'FATAL';

export type RuntimeIntegrityStatus =
  | 'INTACT'
  | 'COMPROMISED'
  | 'UNVERIFIABLE'
  | 'FAIL_CLOSED';

export type ExplainabilityLevel =
  | 'DETERMINISTIC'
  | 'HEURISTIC'
  | 'UNVERIFIABLE';

export type EvidenceIntegrityStatus =
  | 'CRYPTOGRAPHICALLY_VERIFIED'
  | 'SIGNATURE_MISMATCH'
  | 'MISSING_EVIDENCE'
  | 'ORPHANED_HASH';

export type HistoricalConfidenceLevel =
  | 'HIGH_CONFIDENCE'
  | 'MODERATE_CONFIDENCE'
  | 'LOW_CONFIDENCE'
  | 'INSUFFICIENT_HISTORY';

export type InstitutionalRestrictionLevel =
  | 'UNRESTRICTED'
  | 'PARTIALLY_RESTRICTED'
  | 'HEAVILY_RESTRICTED'
  | 'FROZEN';

export type GovernanceComplianceStatus =
  | 'COMPLIANT'
  | 'RESTRICTED_MODE'
  | 'NON_COMPLIANT'
  | 'UNKNOWN';
