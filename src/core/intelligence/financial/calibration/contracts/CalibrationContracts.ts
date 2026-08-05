export type ValidationStatus = "VALID" | "CONFLICT" | "INSUFFICIENT_EVIDENCE";

export interface DiagnosticValidationResult {
  validationStatus: ValidationStatus;
  originalDiagnosis: string;
  evidenceChecked: string[];
  conflictingMetrics: string[];
  confidenceAdjustment: number;
}

export type ContradictionType = 
  | "FALSE_LIQUIDITY_ALARM" 
  | "UNHEALTHY_GROWTH" 
  | "CAPITAL_UNDERUTILIZATION" 
  | "ACCOUNTING_PROFIT_QUALITY_RISK" 
  | "IDLE_CAPITAL_RISK";

export interface ContradictionDetection {
  type: ContradictionType;
  description: string;
  involvedMetrics: string[];
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface ResolvedDiagnosis {
  originalFinding: string;
  detectedConflict: string;
  resolvedDiagnosis: string;
  reasoning: string;
  confidence: number;
  evidenceTrail: string[];
}

export interface FinancialReasoningStatus {
  calibrated: boolean;
  confidenceLevel: number;
  contradictionsResolved: number;
  evidenceQuality: "HIGH" | "MEDIUM" | "LOW";
}
