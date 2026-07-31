import { EvidenceReference } from '@illumine/architecture-governance-registry';
import { ArchitectureFingerprint } from '@illumine/architecture-governance-types';

export type CertificationId = string & { readonly __brand: 'CertificationId' };
export type PolicyId = string & { readonly __brand: 'PolicyId' };
export type AttemptId = string & { readonly __brand: 'AttemptId' };
export type SemanticVersion = string & { readonly __brand: 'SemanticVersion' };

export type CertificationStatusEnum =
  | 'DRAFT'
  | 'ISSUED'
  | 'ACTIVE'
  | 'EXPIRED'
  | 'REVOKED'
  | 'SUPERSEDED';

export type DecisionStatus = 'CERTIFIED' | 'NOT_CERTIFIED';

export interface CertificationRule {
  readonly rule: string;
  readonly input: string; // e.g. "EvaluationObservation.fanOut"
  readonly operator: '<=' | '>=' | '==' | '!=' | '<' | '>';
  readonly threshold: number | string;
}

export interface CertificationPolicy {
  readonly id: PolicyId;
  readonly name: string;
  readonly version: SemanticVersion;
  readonly checksum: string;
  readonly rules: readonly CertificationRule[];
  readonly scope: 'PLATFORM' | 'CAPABILITY' | 'RELEASE';
}

export interface CertificationRequest {
  readonly id: AttemptId; // ID provisório até virar cert
  readonly target: string; // CapabilityId ou ArchitectureTarget
  readonly baseline: string;
  readonly requestedAt: Date;
  readonly requestedBy: string;
}

export interface CertificationAttempt {
  readonly id: AttemptId;
  readonly target: string;
  readonly policy: string;
  readonly result: DecisionStatus;
  readonly duration: string;
}

export interface CertificationDecision {
  readonly status: DecisionStatus;
  readonly policyId: PolicyId;
  readonly policyVersion: string;
  readonly evidenceReferences: readonly EvidenceReference[];
  readonly evaluatedAt: Date;
}

export interface CertificationCertificate {
  readonly id: CertificationId;
  readonly decision: CertificationDecision;
  readonly fingerprint: ArchitectureFingerprint;
  readonly issuedAt: Date;
  readonly status: CertificationStatusEnum;
  readonly immutable: true;
}
