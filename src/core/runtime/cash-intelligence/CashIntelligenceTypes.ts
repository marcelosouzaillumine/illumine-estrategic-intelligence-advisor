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
  fcoBasis?: 'OFFICIAL_FCO' | 'ADJUSTED_OPERATIONAL_BURN';
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
  fcoBasis?: 'OFFICIAL_FCO' | 'ADJUSTED_OPERATIONAL_BURN';
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

export interface CashConstraintDiagnosis {
  primaryConstraint: 'CONSUMO_OPERACIONAL' | 'ESTOQUES' | 'RECEBIVEIS' | 'CAPEX' | 'ENDIVIDAMENTO' | 'PARTES_RELACIONADAS' | 'ESCALA_INSUFICIENTE' | 'MULTIPLAS_RESTRICOES' | 'NENHUMA_RESTRICAO';
  severity: string;
  rationale: string;
  confidenceLevel: CashConfidenceLevel;
  sourceMetrics: Record<string, number>;
}

export interface OperationalCashBurn {
  monthlyBurnRate: number;
  annualBurnRate: number;
  cashConsumptionIntensity: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRITICA' | 'NAO_APLICAVEL';
  rationale: string;
  confidenceLevel: CashConfidenceLevel;
  sourceMetrics: Record<string, number>;
}

export interface ShareholderDependency {
  shareholderDependencyRatio: number;
  capitalizationCoverageRatio: number;
  classification: 'AUTONOMA' | 'BAIXA_DEPENDENCIA' | 'MODERADA_DEPENDENCIA' | 'ALTA_DEPENDENCIA' | 'DEPENDENCIA_CRITICA';
  rationale: string;
  confidenceLevel: CashConfidenceLevel;
  sourceMetrics: Record<string, number>;
  autossuficienciaFinanceiraRatio: number | null;
  autossuficienciaFinanceiraDisplay: string;
  dependenciaCapitalExternoLabel: string;
}

export interface CashSustainability {
  classification: 'AUTOSSUSTENTADA' | 'EM_TRANSICAO' | 'DEPENDENTE_DE_CAPITAL' | 'INSUSTENTAVEL';
  rationale: string;
  confidenceLevel: CashConfidenceLevel;
  sourceMetrics: Record<string, number>;
}

export interface RevenueCashConversion {
  cashConversionPer100Revenue: number;
  classification: 'GERA_CAIXA' | 'EQUILIBRADO' | 'CONSOME_CAIXA' | 'DESTRUI_CAIXA';
  rationale: string;
  confidenceLevel: CashConfidenceLevel;
  sourceMetrics: Record<string, number>;
}

export interface CashBoardDecision {
  cashGenerationAssessment: string;
  primaryConstraint: string;
  runwayAssessment: string;
  shareholderDependency: string;
  boardOutlook: string;
  immediateAction?: string;
  confidenceLevel: CashConfidenceLevel;
  isOperationSelfSustaining: string;
  revenueConversionAssessment?: string;
  boardPriorityAssessment?: string;
  acaoMelhoraLiquidez?: string;
}

export interface DFCCashAdvisory {
  situacaoAtual: string;
  restricaoPrincipal: string;
  dependenciaCapital: string;
  sustentabilidade: string;
  outlook: string;
  parecerConsolidado: string;
  confidenceLevel: CashConfidenceLevel;
  interpretacaoExecutiva?: string;
  boardPriority?: string;
}

export interface CashReinvestment {
  available?: boolean;
  reinvestmentRate: number | null;
  classification: 'REINVESTIMENTO_SAUDAVEL' | 'NAO_APLICAVEL' | 'BAIXO_REINVESTIMENTO' | 'INSUSTENTAVEL';
  displayValue: string;
  rationale: string;
  confidenceLevel: CashConfidenceLevel;
  sourceMetrics: Record<string, number>;
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
  
  // Executive Intelligence Framework Outputs
  cashConstraintDiagnosis?: CashConstraintDiagnosis;
  cashBurnAnalysis?: OperationalCashBurn;
  shareholderDependencyAnalysis?: ShareholderDependency;
  cashSustainabilityAnalysis?: CashSustainability;
  cashConversionAnalysis?: RevenueCashConversion;
  cashBoardDecisionFramework?: CashBoardDecision;
  cashExecutiveAdvisory?: DFCCashAdvisory;
  cashReinvestmentAnalysis?: CashReinvestment;

  // DEEFF v1.0 Outputs
  dfcExecutiveSnapshot?: any;
  cqsExplainability?: any;
  compressedAdvisory?: any;
  consistencyAudit?: any;
  dfcPriorities?: any;

  blockedConclusions: string[];
  allowedConclusions: string[];
  confidenceLevel: CashConfidenceLevel;
  auditTrail: string[];
  lineageHash: string;
  cashIntelligenceLineageHash: string;
  causalReferences: string[];
  score: number;
  runwayMonths?: number;
  longitudinalOut?: LongitudinalCashIntelligenceOutput;
  longitudinalScore?: number | 'NOT_AVAILABLE';
  earningsQuality?: any;
  cashQuality?: any;

  // Roadmap v1.0 properties
  causalIntelligence?: CashFlowCausalIntelligenceOutput;
  scenarioIntelligence?: CashFlowScenarioIntelligenceOutput;
  earlyWarningSystem?: TreasuryEarlyWarningOutput;
  treasurySustainability?: TreasurySustainabilityOutput;
}

export interface CashFlowCausalDriver {
  name: string;
  value: number;
  category: 'Operacional' | 'Comercial' | 'Estoque' | 'Capital de Giro' | 'Estrutura' | 'Funding';
  impactPercent: number;
  type: 'GENERATOR' | 'DESTROYER';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface CashFlowCausalIntelligenceOutput {
  fcoBasis: 'OFFICIAL_FCO' | 'ADJUSTED_OPERATIONAL_BURN';
  fco: number;
  drivers: CashFlowCausalDriver[];
  executiveOutput: {
    title: string;
    ranking: { rank: number; name: string; value: number; impactPercent: number; category: string; severity: string; type: string }[];
  };
  boardOutput: {
    question: string;
    answer: string;
  };
}

export interface CashFlowScenario {
  name: string;
  parameter: string;
  fcoSimulated: number;
  cashSimulated: number;
  runwaySimulated: number;
  dependencySimulated: string;
  runwayDisplay: string;
  fcoBasis: 'ADJUSTED_OPERATIONAL_BURN';
}

export interface CashFlowScenarioGroup {
  scenarioName: string;
  simulations: CashFlowScenario[];
}

export interface CashFlowScenarioIntelligenceOutput {
  currentRunway: number;
  scenarios: CashFlowScenarioGroup[];
  boardOutput: {
    question: string;
    answer: string;
  };
}

export interface TreasuryEarlyWarningAlert {
  metric: 'Runway' | 'FCO' | 'Dependência dos Sócios' | 'Estoques' | 'Clientes';
  value: string;
  status: 'WATCH' | 'WARNING' | 'CRITICAL' | 'SURVIVABILITY_THREAT' | 'NORMAL' | 'ALERT';
  message: string;
  fcoBasis?: 'OFFICIAL_FCO' | 'ADJUSTED_OPERATIONAL_BURN';
}

export interface TreasuryEarlyWarningOutput {
  alerts: TreasuryEarlyWarningAlert[];
  topThreats: string[];
  hasSurvivabilityThreat: boolean;
  fcoBasis: 'ADJUSTED_OPERATIONAL_BURN';
}

export interface TreasurySustainabilityOutput {
  efsiScore: number;
  socialContinuity: {
    capacity: 'Alta' | 'Parcial' | 'Vulnerável' | 'Crítica';
    justification: string;
  };
  governanceLiquidityIntegrity: {
    status: string;
    justification: string;
  };
  reinvestmentCapacityIndex: {
    value: number;
    status: 'Inadequado' | 'Sub-ótimo' | 'Ótimo' | 'Estressado';
    justification: string;
  };
  boardOutput: {
    question: string;
    answer: 'Sim' | 'Parcialmente' | 'Não';
    justification: string;
  };
  fcoBasis: 'ADJUSTED_OPERATIONAL_BURN';
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
