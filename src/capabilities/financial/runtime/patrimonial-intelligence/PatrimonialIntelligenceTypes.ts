import { FinancialRuntimeContext, BlockedConclusion } from "../financial-context/FinancialRuntimeContextTypes";

export type PatrimonialDiagnosisCode = 
  | "PATRIMONIAL_STRUCTURE_HEALTHY"
  | "APPARENT_LIQUIDITY_DISTORTED_BY_INVENTORY"
  | "CAPITAL_CYCLE_RISK_REQUIRES_CASH_VALIDATION"
  | "NGO_SUSTAINABILITY_REQUIRES_RESTRICTED_FUND_SEPARATION"
  | "HEALTHCARE_RECEIVABLES_REQUIRE_REPASSE_VALIDATION"
  | "PROJECT_BASED_CONCENTRATION_RISK"
  | "INSUFFICIENT_CONTEXT_FOR_STRONG_DIAGNOSIS"
  | "INCONSISTENT_BP_DATA_PREVENTS_DIAGNOSIS"
  | "ASSET_LIGHT_STRUCTURE_VALIDATED";

export type BPDataIntegrityStatus = 
  | "VALIDATED"
  | "PARTIAL"
  | "INCONSISTENT"
  | "MISSING";

export interface PatrimonialDiagnosis {
  code: PatrimonialDiagnosisCode;
  executiveExplanation: string;
}

export interface PatrimonialIntelligenceOutput {
  patrimonialDiagnosis: PatrimonialDiagnosis[];
  bpDataIntegrityStatus: BPDataIntegrityStatus;
  contextualAdjustmentsApplied: string[];
  blockedPatrimonialConclusions: BlockedConclusion[];
  allowedPatrimonialConclusions: string[];
  requiredDisclosures: string[];
  interpretationWarnings: string[];
  legacyEngineMigrationNotes: string[];
  confidenceLevel: "HIGH" | "MODERATE" | "LOW" | "RESTRICTED";
  sourceContextReference: string;
  auditTrail: string[];
  lineageHash: string;
}

export const INVENTORY_LIQUIDITY_DISTORTION_THRESHOLD = 0.30;
