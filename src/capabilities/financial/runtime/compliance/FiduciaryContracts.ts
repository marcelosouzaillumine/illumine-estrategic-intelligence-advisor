// src/core/runtime/compliance/FiduciaryContracts.ts
//
// Institutional Fiduciary Runtime Constitution
// Ref: docs/implementation_plan.md

import { RuntimeLabel } from '../../../../i18n/translationKeyGovernance';

export interface FiduciaryRuntimeContract {
  /**
   * Validates if the runtime output adheres strictly to fiduciary rules.
   */
  validateFiduciarySafety(report: any): { isSafe: boolean; violations: RuntimeLabel[] };
}

export interface MathematicalIntegrityContract {
  /**
   * Checks numbers, ensures no NaN/Infinity, preserves signs, and guards against explosive metrics.
   */
  validateMathSanity(metrics: any): { isValid: boolean; errors: RuntimeLabel[] };
}

export interface SemanticGovernanceContract {
  /**
   * Scans narrative text elements to enforce tone sobriety and block emotional or accusatory vocabulary.
   */
  validateSemanticSobriety(report: any): { isValid: boolean; warnings: RuntimeLabel[]; forbiddenTermsFound: RuntimeLabel[] };
}

export interface LineagePropagationContract {
  /**
   * Confirms presence of correct data lineage hashes, inputs, and traceability paths.
   */
  verifyLineage(report: any): { isComplete: boolean; lineageHash?: string; missingFields: RuntimeLabel[] };
}

export interface ConfidencePropagationContract {
  /**
   * Propagates confidence scores from sub-components without artificial inflation.
   */
  propagateConfidence(report: any): { confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'; factors: RuntimeLabel[] };
}

export interface FailClosedContract {
  /**
   * Safely degrades the report structure under conditions of data insufficiency or validation failures.
   */
  applyFailClosed(report: any, reason: string): any;
}

export interface InstitutionalAuditabilityContract {
  /**
   * Returns details of the execution run trace for audit verification.
   */
  generateAuditTrail(report: any): any;
}
