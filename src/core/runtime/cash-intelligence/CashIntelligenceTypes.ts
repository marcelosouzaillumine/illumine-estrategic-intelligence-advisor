export type CashQualityClassification = 'HEALTHY' | 'ATTENTION' | 'DETERIORATING' | 'CRITICAL';
export type CashConfidenceLevel = 'HIGH' | 'MODERATE' | 'RESTRICTED' | 'BLOCKED';

export type FiduciaryLiquidityClassification =
  | 'OPERATIONAL_SUSTAINABLE'
  | 'PARTIALLY_DEPENDENT'
  | 'LIQUIDITY_DEPENDENT'
  | 'ARTIFICIAL_LIQUIDITY'
  | 'CONTINUITY_RISK'
  | 'STRATEGIC_EXPANSION';

export type TemporalReconciliationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RunwayStability = 'STABLE' | 'VOLATILE' | 'FALSE_STABILITY' | 'LOW_CONFIDENCE' | 'COLLAPSING';

export interface FiduciaryLiquidityClassificationOutput {
  classification: FiduciaryLiquidityClassification;
  label: string;
  confidence: CashConfidenceLevel;
  severity: 'SAUDÁVEL' | 'SENSÍVEL' | 'PRESSIONADO' | 'RESTRITIVO' | 'ESTRESSADO' | 'CRÍTICO' | 'COLAPSO';
  rationale: string;
}

export interface ArtificialLiquidityDiagnosis {
  isArtificial: boolean;
  diagnoses: ('LIQUIDITY_DEPENDENT' | 'ARTIFICIAL_LIQUIDITY' | 'EXTERNAL_SURVIVAL_SUPPORT')[];
  liquidityDistortionFactors: string[];
  rationale: string;
  blockedConclusions: string[];
}

export interface CashFlowReconciliationOutput {
  isReconcilable: boolean;
  variancePercentage: number;
  confidence: CashConfidenceLevel;
  reconciliationStatus: 'RECONCILED' | 'ALLOWED_WITH_DISCLOSURE' | 'RESTRICTED' | 'BLOCKED';
  temporalSeverity: TemporalReconciliationSeverity;
  alerts: string[];
  disclosures: string[];
  restrictsOptimisticInterpretations: boolean;
}

export interface InstitutionalContinuityAssessment {
  continuityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  hasRuptureRisk: boolean;
  projectedRunwayMonths: number;
  runwayConfidence: CashConfidenceLevel;
  runwayDistortionFactors: string[];
  runwayStability: RunwayStability;
  liquidityDependency: boolean;
  continuityRiskDrivers: string[];
  recommendedActions: string[];
}

export interface OperationalSustainabilityAssessment {
  isSustained: boolean;
  selfFinancingCapacity: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  operationalCashConsistency: 'HIGH_CONSISTENCY' | 'MODERATE_CONSISTENCY' | 'VOLATILE' | 'INSUFFICIENT_HISTORY';
  operationalFragilityIndex: number; // 0 a 100
  dependencyTrend: 'STRENGTHENING' | 'STABLE' | 'DEGRADATING' | 'CRITICAL';
  resilienceScore: number; // 0 a 100
  longitudinalConsistency: string;
}

export interface FiduciaryCashNarrative {
  executiveNarrative: string;
  fiduciaryOpinion: string;
  fiduciaryWarnings: string[];
  blockedInterpretations: string[];
  causalFindings: string[];
  institutionalImplications: string[];
}

export interface CashIntelligenceRuntimeOutput {
  isAvailable: boolean;
  liquidityClassification: FiduciaryLiquidityClassificationOutput;
  artificialLiquidityDetected: ArtificialLiquidityDiagnosis;
  reconciliationAlerts: CashFlowReconciliationOutput;
  operationalSustainability: OperationalSustainabilityAssessment;
  continuityRisk: InstitutionalContinuityAssessment;
  fiduciaryNarrative: FiduciaryCashNarrative;
  blockedConclusions: string[];
  allowedConclusions: string[];
  confidenceLevel: CashConfidenceLevel;
  auditTrail: string[];
  lineageHash: string;
  cashIntelligenceLineageHash: string;
  causalReferences: string[];
  score: number;
}
