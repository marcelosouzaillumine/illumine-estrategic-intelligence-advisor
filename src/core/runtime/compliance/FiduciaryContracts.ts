// src/core/runtime/compliance/FiduciaryContracts.ts
//
// Institutional Fiduciary Runtime Constitution
// Ref: docs/implementation_plan.md

export interface FiduciaryRuntimeContract {
  /**
   * Validates if the runtime output adheres strictly to fiduciary rules.
   */
  validateFiduciarySafety(report: any): { isSafe: boolean; violations: string[] };
}

export interface MathematicalIntegrityContract {
  /**
   * Checks numbers, ensures no NaN/Infinity, preserves signs, and guards against explosive metrics.
   */
  validateMathSanity(metrics: any): { isValid: boolean; errors: string[] };
}

export interface SemanticGovernanceContract {
  /**
   * Scans narrative text elements to enforce tone sobriety and block emotional or accusatory vocabulary.
   */
  validateSemanticSobriety(report: any): { isValid: boolean; warnings: string[]; forbiddenTermsFound: string[] };
}

export interface LineagePropagationContract {
  /**
   * Confirms presence of correct data lineage hashes, inputs, and traceability paths.
   */
  verifyLineage(report: any): { isComplete: boolean; lineageHash?: string; missingFields: string[] };
}

export interface ConfidencePropagationContract {
  /**
   * Propagates confidence scores from sub-components without artificial inflation.
   */
  propagateConfidence(report: any): { confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'; factors: string[] };
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
