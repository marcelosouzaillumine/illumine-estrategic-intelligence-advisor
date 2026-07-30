/**
 * Illumine OS™ Executive Contracts
 * Financial Integrity & Certification Contract (CFDI v2.1)
 */

export type FinancialViolationCode =
  | 'FIN-001' // Canonical Schema Violation
  | 'FIN-002' // Unknown Client
  | 'FIN-003' // Statement Isolation Violation
  | 'FIN-004' // Cross Statement Inconsistency
  | 'FIN-005' // Legacy Alias Detected
  | 'FIN-006' // Synthetic Data Attempt
  | 'FIN-007' // Uncertified Runtime
  | 'FIN-008' // Missing Lineage
  | 'FIN-009' // Rejected Entry
  | 'FIN-010'; // Quality Score Below Threshold

export type FinancialViolationSeverity = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export interface FinancialViolation {
  readonly code: FinancialViolationCode;
  readonly message: string;
  readonly severity: FinancialViolationSeverity;
  readonly recoverable: boolean;
  readonly evidence?: Record<string, any>;
}

export interface FinancialDataQualityScore {
  readonly score: number; // 0 - 100
  readonly completenessScore: number;
  readonly consistencyScore: number;
  readonly integrityScore: number;
  readonly crossValidationScore: number;
  readonly lineageCoverageScore: number;
  readonly freshnessScore: number;
}

export interface FinancialHealthIndex {
  readonly index: number; // 0 - 100
  readonly status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
}

export interface Certification<T> {
  readonly status: 'CERTIFIED' | 'WARNING' | 'FAILED';
  readonly confidence: number; // 0 - 1
  readonly qualityScore: FinancialDataQualityScore;
  readonly violations: ReadonlyArray<FinancialViolation>;
  readonly warnings: ReadonlyArray<string>;
  readonly certifiedAt: string;
  readonly certifiedBy: string;
  readonly data: T;
}

export type FinancialCertification = Certification<any>;
