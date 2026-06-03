export type CashQualityClassification = 'HEALTHY' | 'ATTENTION' | 'DETERIORATING' | 'CRITICAL';
export type CashConfidenceLevel = 'HIGH' | 'MODERATE' | 'RESTRICTED' | 'BLOCKED';

export type FiduciaryLiquidityClassification =
  | 'OPERATIONAL_SUSTAINABLE'
  | 'PARTIALLY_DEPENDENT'
  | 'LIQUIDITY_DEPENDENT'
  | 'ARTIFICIAL_LIQUIDITY'
  | 'CONTINUITY_RISK'
  | 'STRATEGIC_EXPANSION'
  | 'DEPENDENCIA_DE_CAPITALIZACAO'
  | 'SUSTENTACAO_EXTERNA'
  | 'REINVESTIMENTO_OPERACIONAL_SAUDAVEL'
  | 'TESOURARIA_ESTRUTURALMENTE_SAUDAVEL';

export type TemporalReconciliationSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RunwayStability = 'STABLE' | 'VOLATILE' | 'FALSE_STABILITY' | 'LOW_CONFIDENCE' | 'COLLAPSING';

export type AnalysisPeriodType = 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL' | 'CUSTOM';

export interface FinancialRuntimeContext {
  industrySegment: string;
  businessModel: string;
  maturityStage: string;
  inventoryIntensity: string;
  capitalIntensity: string;
  revenueModel: string;
  workingCapitalProfile: string;
}

export type FinancingReclassification = 
  | 'SURVIVAL_CAPITALIZATION'
  | 'LEVERAGED_SURVIVAL'
  | 'STRATEGIC_EXPANSION_CAPITAL'
  | 'DISTRESS_FINANCING'
  | 'WORKING_CAPITAL_BACKSTOP'
  | 'UNSPECIFIED_EXTERNAL_SUPPORT';

export interface UniversalCashIndicators {
  burnRateOperacional: {
    value: number;
    classification: 'LOW_BURN' | 'MODERATE_BURN' | 'HIGH_BURN' | 'CRITICAL_BURN' | 'NOT_APPLICABLE';
  };
  cashRunwayInstitucional: {
    months: number;
    classification: 'HEALTHY' | 'PRESSURED' | 'CRITICAL' | 'SURVIVAL_MODE';
  };
  dependenciaDeCapitalizacao: {
    value: number;
  };
  dependenciaFornecedores: {
    value: number;
    alert: 'OPERATING_SUPPLIER_DEPENDENCY' | 'NORMAL';
  };
  aprisionamentoCapitalEstoque: {
    value: number;
    alert: 'WORKING_CAPITAL_TRAP' | 'NORMAL';
  };
  exposicaoPartesRelacionadas: {
    value: number | 'NOT_AVAILABLE';
    alert: 'RELATED_PARTY_EXPOSURE_ALERT' | 'NORMAL' | 'NOT_AVAILABLE';
  };
  conversaoEbitdaCaixa: {
    value: number;
    alert: 'SYNTHETIC_PROFIT_ALERT' | 'NORMAL';
  };
  classificacaoFiduciariaFCF: FinancingReclassification;
}

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
  reconciliationStatus: 'RECONCILED' | 'ALLOWED_WITH_DISCLOSURE' | 'RESTRICTED' | 'BLOCKED' | 'CASH_RECONCILIATION_FAIL_CLOSED';
  temporalSeverity: TemporalReconciliationSeverity;
  alerts: string[];
  disclosures: string[];
  restrictsOptimisticInterpretations: boolean;
}

export interface InstitutionalContinuityAssessment {
  continuityRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  hasRuptureRisk: boolean;
  projectedRunwayMonths: number;
  runwayClassification: 'HEALTHY' | 'PRESSURED' | 'CRITICAL' | 'SURVIVAL_MODE';
  runwayConfidence: CashConfidenceLevel;
  runwayDistortionFactors: string[];
  runwayStability: RunwayStability;
  liquidityDependency: boolean;
  continuityRiskDrivers: string[];
  recommendedActions: string[];
}

export interface LegacyOperationalSustainabilityAssessment {
  isSustained: boolean;
  selfFinancingCapacity: 'HIGH' | 'MODERATE' | 'LOW' | 'NONE';
  operationalCashConsistency: 'HIGH_CONSISTENCY' | 'MODERATE_CONSISTENCY' | 'VOLATILE' | 'INSUFFICIENT_HISTORY';
  operationalFragilityIndex: number; // 0 a 100
  dependencyTrend: 'STRENGTHENING' | 'STABLE' | 'DEGRADATING' | 'CRITICAL';
  resilienceScore: number; // 0 a 100
  longitudinalConsistency: string;
}

export interface FiduciaryOperationalSustainabilityAssessment {
  classification: 'OPERATIONALLY_SUSTAINABLE' | 'OPERATIONALLY_PRESSURED' | 'DEPENDENT_ON_EXTERNAL_CAPITAL' | 'STRUCTURAL_CASH_COLLAPSE';
  resilienceScore: number;
  operationalFragilityIndex: number;
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
  contextSegment?: FinancialRuntimeContext;
  universalIndicators: UniversalCashIndicators;
  liquidityClassification: FiduciaryLiquidityClassificationOutput;
  artificialLiquidityDetected: ArtificialLiquidityDiagnosis;
  reconciliationAlerts: CashFlowReconciliationOutput;
  legacyOperationalSustainabilityAssessment: LegacyOperationalSustainabilityAssessment;
  fiduciaryOperationalSustainabilityAssessment: FiduciaryOperationalSustainabilityAssessment;
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
  longitudinalOut?: LongitudinalCashIntelligenceOutput;
  longitudinalScore?: number | 'NOT_AVAILABLE';
}

export type LongitudinalTrajectory = 
  | 'INSUFFICIENT_HISTORICAL_DATA'
  | 'DETERIORATION'
  | 'PROGRESSIVE_DETERIORATION'
  | 'REAL_RECOVERY'
  | 'ARTIFICIAL_TURNAROUND'
  | 'STRUCTURAL_IMPROVEMENT'
  | 'CHRONIC_DEPENDENCY'
  | 'STABLE_SUSTAINABILITY'
  | 'VOLATILE_RECOVERY'
  | 'UNSTABLE_CASH_PROFILE'
  | 'STRUCTURAL_CASH_COLLAPSE';

export interface LongitudinalCashIntelligenceOutput {
  trajectoryClassification: LongitudinalTrajectory;
  longitudinalScore: number | 'NOT_AVAILABLE';
  historicalPatternsDetected: string[];
  runwayEvolutionTrend: 'UP' | 'DOWN' | 'STAGNANT' | 'VOLATILE' | 'NOT_AVAILABLE';
  narrativeLongitudinal: {
    executiveNarrative: string;
    advisoryWarnings: string[];
    isRecoveryReal: boolean | null;
  };
  recoveryNarrativeBlocked: boolean;
  timelineIntegrityStatus: 'VALID' | 'BROKEN' | 'INSUFFICIENT_HISTORY';
  fiduciaryWarnings: string[];
  blockedConclusions: string[];
}
