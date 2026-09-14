// src/core/runtime/constitutional-governance/constitutional-types.ts
//
// Sovereign Institutional Policy, Doctrine & Constitutional Governance Types

export type ConstitutionalIntegrityState =
  | 'CONSTITUTIONALLY_STABLE'
  | 'DOCTRINE_WARNING'
  | 'POLICY_DRIFT'
  | 'CONSTITUTIONAL_CONFLICT'
  | 'AXIOM_VIOLATION'
  | 'CONSTITUTIONAL_FAIL_CLOSED';

export interface GovernanceLineage {
  doctrineLineage: string[];
  runtimeLineage: string[];
  migrationLineage: string[];
  overrideLineage: string[];
  policyLineage: string[];
  assuranceLineage: string[];
  publicationLineage: string[];
  treasuryLineage: string[];
}

export interface ConstitutionalVersionInfo {
  constitutionalVersion: string;
  doctrineVersion: string;
  policyVersion: string;
  migrationVersion: string;
  runtimeCompatibilityMatrix: Record<string, Record<string, boolean>>;
  constitutionalLineageHash: string;
}

export interface FiduciaryAxiom {
  key: string;
  name: string;
  description: string;
  isImmutable: boolean;
  isNonOverridable: boolean;
  versionMetadata?: {
    lastReviewed: string;
    version: string;
    authReference: string;
  };
}

export interface FiduciaryDoctrine {
  doctrineVersion: string;
  ruleset: Record<string, string | number | boolean>;
  doctrineLineageHash: string;
  compatibilityReferences: string[];
  propagationScope: string[];
  migrationRequirements: string[];
}

export interface RuntimePolicy {
  policyVersion: string;
  thresholds: Record<string, number>;
  propagationRules: string[];
  severityEscalationLimits: Record<string, number>;
  survivabilityMinimums: Record<string, number>;
  treasuryRestrictions: string[];
  predictiveBlockingRules: string[];
  publicationCertificationPolicies: string[];
  assuranceVetoRules: string[];
}

export interface ConstitutionalOverrideAttempt {
  overrideId: string;
  actor: string;
  role: string;
  timestamp: string;
  reason: string;
  target: string;
  authorizationStatus: 'APPROVED' | 'REJECTED' | 'ATTEMPTED_FORBIDDEN' | 'UNAUTHORIZED';
  affectedDoctrineOrPolicy: string;
  constitutionalLineageHash: string;
}

export interface ConstitutionalAuditRecord {
  recordId: string;
  timestamp: string;
  type: 'DOCTRINE_PUBLISH' | 'POLICY_UPDATE' | 'MIGRATION_EXECUTE' | 'OVERRIDE_ATTEMPT' | 'AXIOM_AUDIT';
  details: string;
  actor: string;
  role: string;
  overrideAttempt?: ConstitutionalOverrideAttempt;
  constitutionalLineageHash: string;
}

export interface ConstitutionalGovernanceMetadata {
  constitutionalVersion: string;
  doctrineVersion: string;
  policyVersion: string;
  migrationVersion: string;
  constitutionalLineageHash: string;
  integrityState: ConstitutionalIntegrityState;
  detectedConflicts: string[];
  axiomViolations: string[];
  overrideAttempts: ConstitutionalOverrideAttempt[];
  compatibilityStatus: Record<string, boolean>;
  auditRecords: ConstitutionalAuditRecord[];
  status: 'APPROVED' | 'REJECTED';
}

