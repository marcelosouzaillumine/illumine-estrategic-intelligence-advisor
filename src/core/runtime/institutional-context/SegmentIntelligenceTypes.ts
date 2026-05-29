import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";

export type ConfidenceLevel = "HIGH" | "MODERATE" | "LOW" | "RESTRICTED";

export type DownstreamImplication = 
  | "RESTRICT_STRONG_CONCLUSIONS"
  | "PREVENT_STATIC_LIQUIDITY_INTERPRETATION"
  | "REQUIRE_CONTEXTUAL_THRESHOLDS"
  | "ISOLATE_SUSTAINABILITY_FROM_PROFITABILITY"
  | "ADJUST_PATRIMONIAL_EXPECTATIONS"
  | "REQUIRE_HISTORICAL_DENSITY"
  | "NONE";

export interface SegmentIntelligenceAuditEntry {
  ruleName: string;
  sourceFieldsUsed: (keyof InstitutionalBusinessProfile)[];
  deterministicTrigger: string;
  confidenceImpact: "NEUTRAL" | "DECREASE" | "RESTRICT";
  limitationCreated: string;
  downstreamImplication: DownstreamImplication;
}

export interface DownstreamRuntimeRestrictions {
  allowStrongConclusions: boolean;
  allowStaticLiquidityInterpretation: boolean;
  allowStandardProfitabilityMetrics: boolean;
  allowPatrimonialScoring: boolean;
  allowLongitudinalMaturityClaims: boolean;
}

export type InstitutionalConfidenceMatrix = {
  overallConfidence: ConfidenceLevel;
  dataCompleteness: number;
  structuralClarity: number;
  historicalDensityProxy: number;
};

export interface SegmentIntelligenceProfile {
  // Classification
  segmentClassification: string;
  operatingModelClassification: string;
  assetIntensityProfile: "ASSET_LIGHT" | "ASSET_HEAVY" | "MODERATE" | "UNKNOWN";
  workingCapitalCycleProfile: "SHORT" | "MODERATE" | "LONG" | "MISMATCH_RISK" | "UNKNOWN";
  revenueModelSensitivity: "RECURRING" | "PROJECT_BASED" | "SEASONAL" | "STANDARD" | "UNKNOWN";
  marginStructureProfile: "LOW_MARGIN" | "MODERATE_MARGIN" | "HIGH_MARGIN" | "UNKNOWN";
  governanceComplexityLevel: "LOW" | "MEDIUM" | "HIGH" | "MISSION_CRITICAL" | "UNKNOWN";
  institutionalMaturityContext: "EARLY_STAGE" | "MATURE" | "UNKNOWN";
  
  // Guardrails and Constraints
  confidenceLevel: ConfidenceLevel;
  confidenceMatrix: InstitutionalConfidenceMatrix;
  downstreamRuntimeRestrictions: DownstreamRuntimeRestrictions;
  financialInterpretationConstraints: string[];
  recommendedRuntimeAdjustments: string[];
  
  // Traceability
  auditTrail: SegmentIntelligenceAuditEntry[];
}
