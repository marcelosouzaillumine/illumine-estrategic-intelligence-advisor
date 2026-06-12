import { BalanceSheetFinancialMetricsEngine } from "./governance/bp/BalanceSheetFinancialMetricsEngine";
import { ExecutiveAnalysisContext } from "./executive-consolidation/StrategicOpinionConsistencyEngine";
import { PatrimonialScoreExplainabilityEngine } from "./governance/bp/PatrimonialScoreExplainabilityEngine";
import { InstitutionalPatrimonialClassificationEngine } from "./governance/bp/InstitutionalPatrimonialClassificationEngine";
import { PatrimonialExecutiveInterpretationEngine } from "./governance/bp/PatrimonialExecutiveInterpretationEngine";
import { PatrimonialTrendEngine } from "./governance/bp/PatrimonialTrendEngine";
import { PatrimonialGovernanceConsistencyEngine } from "./governance/bp/PatrimonialGovernanceConsistencyEngine";
import { PatrimonialClassificationCeilingEngine } from "./governance/bp/PatrimonialClassificationCeilingEngine";
import { BalanceSheetQualityEngine } from "./governance/bp/BalanceSheetQualityEngine";
import { WorkingCapitalIntelligenceEngine } from "./governance/bp/WorkingCapitalIntelligenceEngine";
import { CapitalStructureIntelligenceEngine } from "./governance/bp/CapitalStructureIntelligenceEngine";
import { PatrimonialPreservationEngine } from "./governance/bp/PatrimonialPreservationEngine";
import { LiquidityRealityEngine } from "./governance/bp/LiquidityRealityEngine";
import { EquityQualityEngine } from "./governance/bp/EquityQualityEngine";
import { BoardPatrimonialAdvisoryEngine } from "./governance/bp/BoardPatrimonialAdvisoryEngine";
import { BoardConsistencyEngine } from "./governance/bp/BoardConsistencyEngine";
import { BalanceSheetExecutiveNarrativeEngine } from "./governance/bp/BalanceSheetExecutiveNarrativeEngine";
import { RuntimeExecutionRegistry } from './observability/RuntimeExecutionRegistry';
import { BalanceSheetSummaryLineageAudit } from './governance/bp/BalanceSheetSummaryLineageAudit';
import { BalanceSheetExerciseBindingGuard } from './governance/bp/BalanceSheetExerciseBindingGuard';
import { BalanceSheetHistoricalContaminationAudit } from './governance/bp/BalanceSheetHistoricalContaminationAudit';
import { BalanceSheetNarrativeTemporalAudit } from './governance/bp/BalanceSheetNarrativeTemporalAudit';
import { BalanceSheetPatrimonialIntelligenceEngine } from './governance/bp/BalanceSheetPatrimonialIntelligenceEngine';
import { BalanceSheetAnalyticalContextIntegrityGuard } from './governance/bp/BalanceSheetAnalyticalContextIntegrityGuard';
import { getSectorProfile } from '../intelligence/sector-behavior-profiles';
import { translateCapitalStructure } from './adapters/capital-structure-adapter';
import { translateCausalityInterpretation } from './adapters/causality-interpretation-adapter';
import { translateSeverityModulation } from './adapters/severity-modulator-adapter';
import { buildBPHierarchy } from '../../lib/bpEngine';
import { calculateDreCascade } from '../../lib/dreCascade';
import { generateDreInsights, DreMetrics } from '../../lib/dreInsights';
import { ExecutiveEconomicQualityEngine } from './governance/dre/ExecutiveEconomicQualityEngine';
import { EBITDARootCauseEngine } from './governance/dre/EBITDARootCauseEngine';
import { EconomicValueIntelligenceEngine } from './governance/dre/EconomicValueIntelligenceEngine';
import { EarningsCompositionEngine } from './governance/dre/EarningsCompositionEngine';
import { InstitutionalConfidenceEngine } from './confidence/InstitutionalConfidenceEngine';
import { ManagementDiscussionAnalysisEngine } from './governance/dre/ManagementDiscussionAnalysisEngine';
import { DREExecutiveInterpretationEngine } from './dre/DREExecutiveInterpretationEngine';
import { EconomicValueNarrativeEngine } from './dre/EconomicValueNarrativeEngine';
import { RevenueEconomicStructureEngine } from './dre/RevenueEconomicStructureEngine';
import { EconomicBurnRateEngine } from './dre/EconomicBurnRateEngine';
import { DREBoardDecisionSupportEngine } from './dre/DREBoardDecisionSupportEngine';
import { DREBoardAdvisoryEngine } from './dre/DREBoardAdvisoryEngine';
import { RecoverabilityAssessmentEngine } from './dre/RecoverabilityAssessmentEngine';
import { BreakEvenAnalysisEngine } from './dre/BreakEvenAnalysisEngine';
import { OperationalAbsorptionEngine } from './dre/OperationalAbsorptionEngine';
import { OperationalHealthExplainabilityEngine } from './dre/OperationalHealthExplainabilityEngine';
import { CrossStatementIsolationValidator } from './dre/CrossStatementIsolationValidator';
import { EconomicDiagnosisEngine } from './dre/EconomicDiagnosisEngine';
import { DREExecutiveDataMapper } from './dre/DREExecutiveDataMapper';
import { DREExecutiveBindingAudit } from './dre/DREExecutiveBindingAudit';
import { InstitutionalLineageTracer } from './lineage/InstitutionalLineageTracer';
import { DRE_OFFICIAL_STRUCTURE } from '../../constants/dreStructure';
import { calculateFinancialMetrics } from '../../lib/financial-engine';
import { inferBusinessIdentity } from '../../lib/business-identity-engine';
import { evaluateMasterCausality } from '../../lib/master-causal-engine';
import { ConsolidatedRuntimeOutputExt } from './consolidated/consolidated-types';
import { TemporalCausalityOutput } from '../intelligence/temporal-causality-engine';
import { RuntimeExecutionTrace } from './observability/observability-types';
import { RuntimeTraceEngine } from './observability/RuntimeTraceEngine';
import { InstitutionalContextEngine } from './institutional-context/InstitutionalContextEngine';
import { InstitutionalContextProfile } from './institutional-context/types';
import { InventoryDependencyEngine } from './governance/bp/InventoryDependencyEngine';
import { CalibrationEngine } from './calibration/CalibrationEngine';
import { SegmentCode } from './segment-intelligence/types';
import { SegmentRiskProfileEngine } from './segment-intelligence/SegmentRiskProfileEngine';
import { LongitudinalIntelligenceGuard } from './coherence/LongitudinalIntelligenceGuard';
import { InstitutionalMemoryEngine } from './institutional-memory/InstitutionalMemoryEngine';
import { InstitutionalMemoryProfile } from './institutional-memory/types';
import { StructuralCapitalOrchestrator } from './structural-capital/StructuralCapitalOrchestrator';
import { StructuralCapitalProfile } from './structural-capital/types';
import { InstitutionalCausalityOrchestrator } from './institutional-causality/InstitutionalCausalityOrchestrator';
import { InstitutionalCausalityProfile } from './institutional-causality/types';
import { ExecutivePriorityCascadeResolver } from './institutional-causality/ExecutivePriorityCascadeResolver';
import { ExecutiveNarrativeSanitizer } from './institutional-causality/ExecutiveNarrativeSanitizer';
import { getIndustryOkrs } from '../../lib/industry-engine';
import { FiduciaryCashIntelligenceRuntime } from './cash-intelligence/FiduciaryCashIntelligenceRuntime';
import { CashIntelligenceRuntimeOutput } from './cash-intelligence/CashIntelligenceTypes';
import { InstitutionalCausalIntelligenceRuntime } from './causal-intelligence/InstitutionalCausalIntelligenceRuntime';
import { CausalIntelligenceReport } from './causal-intelligence/types';
import { TreasuryIntelligenceRuntime } from './treasury-intelligence/TreasuryIntelligenceRuntime';
import { TreasuryIntelligenceRuntimeOutput } from './treasury-intelligence/types';
import { PatrimonialIntelligenceRuntime } from './patrimonial-intelligence/PatrimonialIntelligenceRuntime';
import { InstitutionalSurvivalHierarchyEngine } from './institutional-survival/InstitutionalSurvivalHierarchyEngine';
import { InstitutionalSurvivalOutput } from './institutional-survival/SurvivalTypes';
import { InstitutionalRecoveryEngine } from './institutional-recovery/InstitutionalRecoveryEngine';
import { InstitutionalRecoveryOutput } from './institutional-recovery/RecoveryTypes';
import { SurvivalConstraintPropagationEngine } from './institutional-survival/SurvivalConstraintPropagationEngine';
import { TreasuryPriorityMatrixEngine } from './treasury-intelligence/TreasuryPriorityMatrixEngine';
import { InstitutionalResilienceEngine } from './institutional-resilience/InstitutionalResilienceEngine';
import { RecoveryRegressionGuardEngine } from './recovery-regression/RecoveryRegressionGuardEngine';
import { InstitutionalPressureRuntime } from './operating-pressure/InstitutionalPressureRuntime';
import { PressureAdapter } from './operating-pressure/pressure-adapter';
import { ExecutiveTimelineEngine } from './executive-timeline/ExecutiveTimelineEngine';
import { InstitutionalCausalityExplorer } from './causal-intelligence/InstitutionalCausalityExplorer';

// Integrity Engines (RC-1.3A)
import { EmptyCycleIntegrityEngine } from './integrity/EmptyCycleIntegrityEngine';
import { BenchmarkGovernanceRegistry } from './integrity/BenchmarkGovernanceRegistry';
import { BenchmarkReferenceEngine } from './integrity/BenchmarkReferenceEngine';
import { ScaleEfficiencyIntegrityEngine } from './integrity/ScaleEfficiencyIntegrityEngine';
import { InvalidMetricGuard } from './integrity/InvalidMetricGuard';
import { ExecutiveActionMatrixEngine, ExecutiveActionItem } from './integrity/ExecutiveActionMatrixEngine';
import { HistoricalSeriesIntegrityEngine } from './integrity/HistoricalSeriesIntegrityEngine';
import { ExecutiveEmptyStateResolver } from './integrity/ExecutiveEmptyStateResolver';
import { ExecutiveDiagnosisComposer } from '../executive-experience/ExecutiveDiagnosisComposer';
import { InstitutionalFinancialDomainOrchestrator } from './orchestrator/InstitutionalFinancialDomainOrchestrator';
import { InstitutionalViewContract } from './orchestrator/InstitutionalViewContract';
import { InstitutionalExecutiveCommandRuntime } from './executive-command/InstitutionalExecutiveCommandRuntime';
import { InstitutionalOperationalGovernanceRuntime } from './operational-governance/InstitutionalOperationalGovernanceRuntime';
import { InstitutionalStrategicIntelligenceRuntime } from './strategic-intelligence/InstitutionalStrategicIntelligenceRuntime';
import { InstitutionalBoardPackRuntime } from './institutional-reporting/InstitutionalBoardPackRuntime';
import { InstitutionalDeploymentReadinessEngine } from './deployment-readiness/InstitutionalDeploymentReadinessEngine';
import { DeploymentEnvironment } from './deployment-readiness/DeploymentReadinessTypes';
import { InstitutionalOnboardingOrchestrator } from './institutional-onboarding/InstitutionalOnboardingOrchestrator';
import { InstitutionalOnboardingMockFactory } from '../../testing/fixtures/institutional-onboarding/InstitutionalOnboardingMockFactory';
import { InstitutionalEvidenceOrchestrator } from './evidence-ingestion/InstitutionalEvidenceOrchestrator';
import { InstitutionalEvidenceMockFactory } from '../../testing/fixtures/evidence-ingestion/InstitutionalEvidenceMockFactory';
import { readRuntimeEnvironmentConfig } from './config/RuntimeEnvironmentConfig';
import { ExecutiveConstitutionalRuntime } from './constitutional-governance/ExecutiveConstitutionalRuntime';
import { ConstitutionalEnforcementGate } from './constitutional-governance/ConstitutionalEnforcementGate';
import { ConstitutionalRestrictionEngine } from './constitutional-governance/ConstitutionalRestrictionEngine';
import { ConstitutionalGovernanceMetadata } from './constitutional-governance/constitutional-types';
import { ConstitutionalGovernanceDashboardEngine } from './constitutional-governance/ConstitutionalGovernanceDashboardEngine';

const constRuntime = new ExecutiveConstitutionalRuntime();

// EFOS Engines & Adapters (RC-1.4)
import { CashFlowAdapter } from './cashflow/cashflow-adapter';
import { LongitudinalCashIntelligenceEngine } from './cash-intelligence/LongitudinalCashIntelligenceEngine';
import { GlobalFiduciaryDistributionEnforcementEngine } from './governance/fiduciary-enforcement/GlobalFiduciaryDistributionEnforcementEngine';
import { ConsolidatedCashFlowReport } from './cashflow/cashflow-types';
import { CapitalGovernanceAdapter } from './capital-governance/capital-governance-adapter';
import { ConsolidatedCapitalGovernanceReport } from './capital-governance/capital-governance-types';
import { FinancialRuntimeContextAdapter } from './financial-context/FinancialRuntimeContextAdapter';
import { InstitutionalBusinessProfile } from './institutional-identity/InstitutionalBusinessProfile';
import { InstitutionalFinancialThesisEngine } from './InstitutionalFinancialThesisEngine';
import { CrossStatementCausalityEngine, CrossStatementCausalityReport } from './CrossStatementCausalityEngine';
import { SemanticComplianceAuditRuntime } from './constitutional-governance/SemanticComplianceAuditRuntime';
import { ConstitutionalGovernanceRuntime } from './constitutional-governance/ConstitutionalGovernanceRuntime';
import { TemporalEvidenceFilter } from './temporal-governance/TemporalEvidenceFilter';
import { ConstitutionalDecisionRuntime } from './decision-intelligence/ConstitutionalDecisionRuntime';
import { ScenarioImpactRuntime } from './scenario-intelligence/ScenarioImpactRuntime';
import { InstitutionalPrudencyLayer } from './prudency/InstitutionalPrudencyLayer';
import { ExecutiveNarrativeOrchestrator, OrchestratedNarrative } from './ExecutiveNarrativeOrchestrator';
import { ExecutiveNarrativeHarmonizer } from './narrative/ExecutiveNarrativeHarmonizer';
import { ExecutivePriorityConsolidationEngine } from './ExecutivePriorityConsolidationEngine';
import { ExecutiveExperienceConsistencyEngine, ConsistencyValidationResult } from './ExecutiveExperienceConsistencyEngine';
import { KPISemanticIntelligenceEngine } from './KPISemanticIntelligenceEngine';
import {
  FiduciaryRuntimeContract,
  MathematicalIntegrityContract,
  SemanticGovernanceContract,
  LineagePropagationContract,
  ConfidencePropagationContract,
  FailClosedContract,
  InstitutionalAuditabilityContract
} from './compliance/FiduciaryContracts';
import { RuntimeComplianceEngine } from './compliance/RuntimeComplianceEngine';

/**
 * INSTITUTIONAL RUNTIME ENFORCER
 * 
 * ============================================================================
 * PRINCÍPIO CENTRAL: Nenhuma inteligência pode nascer fora do Core Institucional.
 * ============================================================================
 * 
 * Este contrato (ExecutiveIntelligenceReport) é a SINGLE SOURCE OF TRUTH da plataforma.
 * Toda página React, Hook ou Modal operará exclusivamente como DUMMY RENDERER.
 * 
 * É PROIBIDO em camadas de UI:
 * - Fazer if/else para calcular severidade (ex: if liquidez < 1).
 * - Gerar narrativas ou diagnósticos parciais.
 * - Alterar pesos matemáticos ou classificações financeiras.
 */
export interface ExecutiveIntelligenceReport extends ConsolidatedRuntimeOutputExt {
  isSandbox?: boolean;
  isDemonstrative?: boolean;
  fiduciaryWarnings?: string[];
  constitutionalDashboard?: import('./constitutional-governance/constitutional-dashboard-types').ConstitutionalGovernanceDashboardOutput;
  canonicalState?: {
    status: string;
    trend: string;
    severity: string;
    confidence: string;
    posture: string;
    restrictions: string[];
    fiduciaryWarnings: string[];
  };
  context: {
    segment: string;
    businessModel: string;
    capitalIntensity: string;
    stage: string;
    operationalProfile: string;
  };
  institutionalContext: InstitutionalContextProfile;
  scores: {
    financial: number;
    operational: number;
    governance: number;
    structural: number;
    composite: number;
    financialStress?: {
      isStressed: boolean;
      stressFactors: string[];
      runwayImpact: number;
      recommendedActions: string[];
    };
  };
  capitalStructure: {
    qualityRating: string;
    elasticity: string;
    rolloverRisk: string;
    operationalDependency: string;
  };
  causality: {
    event?: string;
    rootCause?: string;
    financialPropagation?: string;
    absorptionCapacity?: string;
    strategicImpact?: string;
    insights?: {
      category: string;
      text: string;
      colorClass: string;
      bgClass: string;
      dotClass: string;
    }[];
    primaryCause?: string;
    secondaryCauses?: string[];
    causalChains?: import('./causal-intelligence/causal-types').CausalChain[];
    confidenceLevel?: import('./causal-intelligence/causal-types').CausalConfidence;
    supportingEvidence?: import('./causal-intelligence/causal-types').CausalEvidence[];
    executiveNarrative?: string;
    lineageHash?: string;
  };
  severity: {
    // Escala oficial da Severity Modulator Engine
    level: 'SAUDÁVEL' | 'SENSÍVEL' | 'PRESSIONADO' | 'RESTRITIVO' | 'ESTRESSADO' | 'CRÍTICO' | 'COLAPSO';
    justification: string;
  };
  advisory: {
    executiveSummary: string;
    actionMatrix: any[];
    priorityFocus: string;
    fiduciaryEnforcement?: any;
  };
  decomposition: {
    label: string;
    value: number;
    severityColor: string; // The UI will just use this class blindly
    explanation: string;
    disabled?: boolean;
    badge?: string;
    displayValue?: string;
  }[];
  prudency?: import('./prudency/InstitutionalPrudencyLayer').PrudencyOutput;
  propagationChains?: any[];
  fiduciaryRationale?: any;
  fiduciaryEnforcement?: any;
  metrics: {
    hasData: boolean;
    dreInsights?: {
      normalizedDRE?: any;
      revenueEconomicStructure?: any;
      economicBurnRate?: any;
      breakEvenAnalysis?: any;
      operationalAbsorption?: any;
      economicDiagnosis?: any;
      dreExecutiveAdvisory?: any;
      dreBoardDecisionSupport?: any;
      bindingAudit?: any;
      [key: string]: any;
    };
    financialMetrics: Record<string, unknown>;
    kpis: {
      name: string;
      val: number | string;
      unit: string;
      status: 'Verde' | 'Amarelo' | 'Vermelho' | 'Neutro';
      trend: string;
      tooltip?: string;
    }[];
    efficiencies: {
      name: string;
      value: number;
      score?: number;
      unit?: string;
      desc: string;
      color: string;
    }[];
    scaleEfficiency: {
      category: string;
      colorClass: string;
      recGrowth: number | null;
      ebitdaGrowth: number | null;
      description: string;
    };
    alerts: {
      type: 'danger' | 'warning';
      msg: string;
    }[];
    chartData: any[];
  };
  compliance: {
    runtimeMode: 'BALANCE_SHEET_ONLY' | 'DRE_ONLY' | 'CASHFLOW_ONLY' | 'PARTIAL_FINANCIAL_VIEW' | 'FULL_FINANCIAL_VIEW';
    confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
    dataCompleteness: number; // percentage or fraction
    causalDepth: 'SHALLOW' | 'MODERATE' | 'DEEP';
    narrativeRestrictions: string[];
    auditFlags: string[];
    fiduciaryEnforcement?: any;
  };
  temporalCausality?: TemporalCausalityOutput;
  // Scenario Simulation
  scenarioProjections?: any;
  
  // Observability (Phase 4)
  runtimeMetadata?: RuntimeExecutionTrace;
  semanticCompliance?: import('./constitutional-governance/SemanticComplianceAuditRuntime').SemanticComplianceReport;
  constitutionalCompliance?: import('./constitutional-governance/ConstitutionalComplianceReport').ConstitutionalComplianceReport;
  decisionIntelligence?: import('./decision-intelligence/ExecutiveDecisionReport').ExecutiveDecisionReport | { status: 'CDIL_BLOCKED_BY_CGL' };
  scenarioIntelligence?: import('./scenario-intelligence/InstitutionalScenarioReport').InstitutionalScenarioReport[];
  constitutionalEvaluation?: import("./constitutional-governance/constitutional-types").ConstitutionalGovernanceMetadata;
  institutionalMemory?: InstitutionalMemoryProfile;
  institutionalCausality?: any;
  structuralCapital?: StructuralCapitalProfile;

  // EFOS Fields (RC-1.4)
  cashSustainabilityReport?: CashIntelligenceRuntimeOutput; // NEW FIDUCIARY CASH INTELLIGENCE
  causalIntelligenceReport?: CausalIntelligenceReport;
  treasuryIntelligenceReport?: TreasuryIntelligenceRuntimeOutput; // NEW SOVEREIGN TREASURY INTELLIGENCE
  cashFlowReport?: ConsolidatedCashFlowReport; // LEGACY ADAPTER
  capitalGovernanceReport?: ConsolidatedCapitalGovernanceReport;
  survivalReport?: InstitutionalSurvivalOutput;
  recoveryReport?: InstitutionalRecoveryOutput;
  patrimonialIntelligenceReport?: any;
  patrimonialStructuralRestrictions?: import('./governance/bp/PatrimonialClassificationCeilingEngine').PatrimonialClassificationCeilingOutput;
  operatingPressureReport?: import('./operating-pressure/operating-pressure-types').InstitutionalPressureRuntimeOutput;
  financialThesis?: {
    thesis: string;
    tensions: string[];
    pressures: string[];
    structuralRisks: string[];
  };
  crossStatementCausality?: CrossStatementCausalityReport;
  orchestratedNarrative?: OrchestratedNarrative;
  consistencyReport?: ConsistencyValidationResult;
  longitudinalCashIntelligence?: import('./cash-intelligence/CashIntelligenceTypes').LongitudinalCashIntelligenceOutput;
  institutionalView: InstitutionalViewContract;
  resilienceReport?: import('./institutional-resilience/ResilienceTypes').InstitutionalResilienceOutput;
  regressionReport?: import('./recovery-regression/RecoveryRegressionTypes').RecoveryRegressionOutput;
  executiveCommand?: import('./executive-command/executive-command-types').InstitutionalExecutiveCommandOutput;
  operationalGovernance?: import('./operational-governance/operational-governance-types').InstitutionalOperationalGovernanceOutput;
  strategicIntelligence?: import('./strategic-intelligence/strategic-intelligence-types').InstitutionalStrategicIntelligenceOutput;
  institutionalBoardPack?: import('./institutional-reporting/institutional-reporting-types').InstitutionalBoardPackOutput;
  deploymentReadiness?: import('./deployment-readiness/DeploymentReadinessTypes').InstitutionalDeploymentReadinessOutput;
  institutionalOnboarding?: import('./institutional-onboarding/InstitutionalOnboardingTypes').InstitutionalOnboardingOutput;
  institutionalEvidence?: import('./evidence-ingestion/InstitutionalEvidenceTypes').InstitutionalEvidenceValidationOutput;
  inferences?: Record<string, { metrics: any; narrative?: any; confidence?: string; score?: number }>;
  timeline?: import('./executive-timeline/executive-timeline-types').ExecutiveTimelineOutput;
  temporalAudit?: any;
  fiduciaryCausality?: import('./causal-intelligence/causal-types').InstitutionalCausalityOutput;
  featureFlags?: any;
}

export class ExecutiveIntelligenceRuntime implements
  FiduciaryRuntimeContract,
  MathematicalIntegrityContract,
  SemanticGovernanceContract,
  LineagePropagationContract,
  ConfidencePropagationContract,
  FailClosedContract,
  InstitutionalAuditabilityContract
{
  // Delegated constitution methods
  public validateFiduciarySafety(report: any) {
    return RuntimeComplianceEngine.getInstance().validateFiduciarySafety(report);
  }
  public validateMathSanity(metrics: any) {
    return RuntimeComplianceEngine.getInstance().validateMathSanity(metrics);
  }
  public validateSemanticSobriety(report: any) {
    return RuntimeComplianceEngine.getInstance().validateSemanticSobriety(report);
  }
  public verifyLineage(report: any) {
    return RuntimeComplianceEngine.getInstance().verifyLineage(report);
  }
  public propagateConfidence(report: any) {
    return RuntimeComplianceEngine.getInstance().propagateConfidence(report);
  }
  public applyFailClosed(report: any, reason: string) {
    return RuntimeComplianceEngine.getInstance().applyFailClosed(report, reason);
  }
  public generateAuditTrail(report: any) {
    return RuntimeComplianceEngine.getInstance().generateAuditTrail(report);
  }

  /**
   * Fluxo Oficial Obrigatório:
   * Importação -> Governança -> Contextualização -> Causalidade -> Modulação -> Advisory -> Executive Report -> UI
   */
  public generateExecutiveReport(rawData: any, externalMetadata?: any): ExecutiveIntelligenceReport {
    // Validação de "Não-Bypass": Sem dados brutos válidos, aborta a execução
    if (!rawData || typeof rawData !== 'object' || (!rawData.bpData && !rawData.rawFinancialData)) {
      throw new Error('VIOLAÇÃO DE GOVERNAÇA NÚCLEO: Impossível gerar relatório de inteligência executiva sem dados de entrada válidos.');
    }

    // TFIF v1.0 (Temporal Fiduciary Integrity Framework)
    // Prevent future year data from bleeding into analysis of past years
    const filterYear = Number(rawData.rawFinancialData?.filterYear || rawData.filterYear || rawData.year);
    let tempValidation: any = null;
    if (!isNaN(filterYear)) {
      const filterRes = TemporalEvidenceFilter.filter(rawData, filterYear);
      const filtered = filterRes.filteredRawData;
      tempValidation = filterRes.validationResult;

      // Mutate rawData arrays in-place to ensure backward compatibility/mutations
      if (filtered.bpData) rawData.bpData = filtered.bpData;
      if (filtered.dreData) rawData.dreData = filtered.dreData;
      if (filtered.dfcData) rawData.dfcData = filtered.dfcData;
      if (filtered.dfcDataForRuntime) rawData.dfcDataForRuntime = filtered.dfcDataForRuntime;
      if (filtered.dlpaData) rawData.dlpaData = filtered.dlpaData;
      if (filtered.historicalSeries) rawData.historicalSeries = filtered.historicalSeries;
      if (filtered.historicalCyclesRaw) rawData.historicalCyclesRaw = filtered.historicalCyclesRaw;
      if (rawData.rawFinancialData) {
        if (filtered.rawFinancialData.allHistoryData) rawData.rawFinancialData.allHistoryData = filtered.rawFinancialData.allHistoryData;
        if (filtered.rawFinancialData.currentYearData) rawData.rawFinancialData.currentYearData = filtered.rawFinancialData.currentYearData;
      }
    }

    const traceEngine = new RuntimeTraceEngine('SINGLE_ENTITY');
    traceEngine.Profiler.startEngine('ExecutiveIntelligenceRuntime');
    traceEngine.Lineage.startNode('ExecutiveIntelligenceRuntime', ['rawData']);

    // ── Dicionário de tradução de enums para português fluido ──────────────────────────
    const enumLabels: Record<string, string> = {
      // BusinessStage
      FIRST_OPERATIONAL_YEAR:          'Primeiro Ano Operacional',
      EARLY_STAGE_CONSOLIDATION:       'Consolidação Inicial',
      GROWTH_STAGE:                    'Estágio de Crescimento',
      SCALE_STAGE:                     'Estágio de Escala',
      MATURE_OPERATION:                'Operação Madura',
      TURNAROUND_DISTRESS:             'Turnaround / Recuperação',
      DECLINE_STAGE:                   'Estágio de Declinio',
      TRANSITION_STAGE:                'Estágio de Transição',
      // EconomicModel
      ASSET_HEAVY:                     'Intensivo em Ativos',
      ASSET_LIGHT:                     'Leve em Ativos',
      CAPITAL_INTENSIVE:               'Intensivo em Capital',
      INVENTORY_DEPENDENT:             'Dependente de Estoques',
      LABOR_INTENSIVE:                 'Intensivo em Mão de Obra',
      RECURRING_REVENUE:               'Receita Recorrente',
      SEASONAL_REVENUE:                'Receita Sazonal',
      SERVICE_BASED:                   'Baseado em Serviços',
      INDUSTRIAL:                      'Industrial',
      DISTRIBUTION:                    'Distribuição',
      SAAS:                            'SaaS',
      HEALTHCARE:                      'Saúde',
      HOLDING_STRUCTURE:               'Holding',
      FINANCIAL_OPERATION:             'Operação Financeira',
      // HistoricalDensity
      SINGLE_YEAR_ONLY:                'Apenas um Exercício Disponível',
      LOW_HISTORICAL_DENSITY:          'Histórico Inicial (< 2 anos)',
      MODERATE_HISTORY:                'Histórico Moderado (2–3 anos)',
      STRONG_HISTORICAL_BASE:          'Base Histórica Sólida (4+ anos)',
      // StrategicConfidence
      HIGH:                            'Alta',
      MODERATE:                        'Moderada',
      LOW:                             'Baixa',
      LIMITED_CONTEXT:                 'Contexto Limitado',
      UNVERIFIABLE:                    'Insuficiência de Dados',
      // GrowthPattern
      HEALTHY_GROWTH:                  'Crescimento Saudável',
      ARTIFICIAL_GROWTH:               'Crescimento Artificial',
      CASHLESS_GROWTH:                 'Crescimento sem Geração de Caixa',
      DEBT_FINANCED_GROWTH:            'Crescimento Financiado por Dívida',
      SHAREHOLDER_FINANCED_GROWTH:     'Crescimento Financiado por Sócios',
      SUSTAINABLE_OPERATIONAL_EXPANSION: 'Expansão Operacional Sustentável',
      PREMATURE_EXPANSION:             'Expansão Prematura',
      STAGNATION:                      'Estagnação',
      CONTRACTION:                     'Contração',
      // runtimeMode
      FULL_FINANCIAL_VIEW:             'Visão Financeira Completa',
      PARTIAL_FINANCIAL_VIEW:          'Visão Financeira Parcial',
      BALANCE_SHEET_ONLY:              'Apenas Balanço Patrimonial',
      DRE_ONLY:                        'Apenas DRE',
      CASHFLOW_ONLY:                   'Apenas Fluxo de Caixa',
      // confidenceLevel
      HIGH_CONFIDENCE:                 'Alta Confiabilidade',
      MEDIUM_CONFIDENCE:               'Confiabilidade Moderada',
      LOW_CONFIDENCE:                  'Confiabilidade Reduzida',
    };
    const pt = (key: string): string => enumLabels[key] || key.replace(/_/g, ' ').toLowerCase().replace(/^./, c => c.toUpperCase());


    // Initialize Institutional Memory
    const memoryProfile = InstitutionalMemoryEngine.buildMemory(rawData.runtimeHistory || []);

    // Initialize Institutional Causality
    const causalityProfile = InstitutionalCausalityOrchestrator.evaluate(rawData.runtimeHistory || []);

    // 0. Runtime Context Awareness
    const hasDRE = !!rawData.dreData && Array.isArray(rawData.dreData) && rawData.dreData.length > 0;
    // Accept either raw bpData array OR pre-computed bpSummary from the page
    const hasBP = (!!rawData.bpData && Array.isArray(rawData.bpData) && rawData.bpData.length > 0)
               || (!!rawData.rawFinancialData?.bpSummary && Object.keys(rawData.rawFinancialData.bpSummary).length > 0);
    const hasCashFlow = !!rawData.cashFlowData && Array.isArray(rawData.cashFlowData) && rawData.cashFlowData.length > 0;

    let runtimeMode: 'BALANCE_SHEET_ONLY' | 'DRE_ONLY' | 'CASHFLOW_ONLY' | 'PARTIAL_FINANCIAL_VIEW' | 'FULL_FINANCIAL_VIEW' = 'PARTIAL_FINANCIAL_VIEW';

    if (hasBP && hasDRE && hasCashFlow) {
      runtimeMode = 'FULL_FINANCIAL_VIEW';
    } else if (hasBP && hasDRE) {
      runtimeMode = 'PARTIAL_FINANCIAL_VIEW';
    } else if (hasBP && !hasDRE && !hasCashFlow) {
      runtimeMode = 'BALANCE_SHEET_ONLY';
    } else if (!hasBP && hasDRE && !hasCashFlow) {
      runtimeMode = 'DRE_ONLY';
    } else if (!hasBP && !hasDRE && hasCashFlow) {
      runtimeMode = 'CASHFLOW_ONLY';
    } else {
      runtimeMode = 'PARTIAL_FINANCIAL_VIEW';
    }

    // Confidence Integrity Layer
    let confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' = 'HIGH_CONFIDENCE';
    let causalDepth: 'SHALLOW' | 'MODERATE' | 'DEEP' = 'DEEP';
    let dataCompleteness = 1.0;

    if (memoryProfile.recurrenceConfidence === 'LOW' && memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
      confidenceLevel = 'LOW_CONFIDENCE';
    }

    if (runtimeMode === 'FULL_FINANCIAL_VIEW') {
       confidenceLevel = 'HIGH_CONFIDENCE';
       causalDepth = 'DEEP';
       dataCompleteness = 1.0;
    } else if (runtimeMode === 'PARTIAL_FINANCIAL_VIEW') {
       confidenceLevel = 'MEDIUM_CONFIDENCE';
       causalDepth = 'MODERATE';
       dataCompleteness = 0.66;
    } else if (runtimeMode === 'BALANCE_SHEET_ONLY') {
       // BP alone is sufficient to display the score — treat as medium confidence
       confidenceLevel = 'MEDIUM_CONFIDENCE';
       causalDepth = 'MODERATE';
       dataCompleteness = 0.5;
    } else {
       confidenceLevel = 'LOW_CONFIDENCE';
       causalDepth = 'SHALLOW';
       dataCompleteness = 0.33;
    }

    // Narrative Governance
    const narrativeRestrictions: string[] = [];
    if (runtimeMode !== 'FULL_FINANCIAL_VIEW') {
       narrativeRestrictions.push(
         'NÃO inferir turnaround estrutural.',
         'NÃO inferir colapso irreversível.',
         'NÃO inferir deterioração longitudinal conclusiva.',
         'Utilizar linguagem de evidências limitadas ("sinais", "indícios", "visão parcial").'
       );
    }

    // === EFOS EVIDENCE INGESTION LAYER ===
    // This is the earliest fiduciary layer. It intercepts the payload before institutional contexts are evaluated.
    const envType = process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'DEVELOPMENT';
    const evidenceInput = InstitutionalEvidenceMockFactory.createEvidenceInputFromRawData(rawData, envType);
    const evidenceReport = InstitutionalEvidenceOrchestrator.evaluate(evidenceInput);

    if (evidenceReport.fiduciaryInterpretationBlocked) {
      confidenceLevel = 'LOW_CONFIDENCE';
      causalDepth = 'SHALLOW';
      narrativeRestrictions.push('INTERPRETAÇÃO FIDUCIÁRIA BLOQUEADA: Evidência não-validada, contaminada ou inconsistente.');
    }

    // 1. Camada Base Institucional de Inteligência Contextual
    const institutionalContext = InstitutionalContextEngine.resolve(rawData);

    if (!institutionalContext || !institutionalContext.institutionalMaturity.code || !institutionalContext.operationalModel.code || !institutionalContext.institutionalMaturity.historicalSupportLevel) {
      throw new Error('VIOLAÇÃO DE GOVERNAÇA NÚCLEO: Impossível gerar relatório de inteligência executiva sem um InstitutionalContextProfile válido.');
    }

    let bpSummary: any = rawData.rawFinancialData?.bpSummary || rawData.bpSummary || {};
    

    // Contextualização (Segment Intelligence Matrix integrada ao Perfil Institucional)
    const segment = rawData.rawFinancialData?.segmentoEmpresa || 'Default';
    const sectorProfile = getSectorProfile(segment);

    const context = {
      segment: sectorProfile.name, 
      businessModel: pt(institutionalContext.operationalModel.label),
      capitalIntensity: institutionalContext.operationalModel.code === 'ASSET_HEAVY' ? 'Intensivo em Ativos' : 'Leve em Ativos',
      stage: pt(institutionalContext.institutionalMaturity.label),
      operationalProfile: 'MODERATE' // Fallback for removed field
    };

    // 2. Data Initialization for Core Engines
    if (rawData.bpData && Array.isArray(rawData.bpData) && rawData.bpData.length > 0) {
      // Raw entries array: build hierarchy first
      const hierarchy = buildBPHierarchy(rawData.bpData);
      const cleanHierarchySummary: any = {};
      for (const [key, value] of Object.entries(hierarchy.summary)) {
        if (value !== false && value !== null && value !== undefined && (!Array.isArray(value) || value.length > 0)) {
          cleanHierarchySummary[key] = value;
        }
      }
      bpSummary = {
        ...rawData.rawFinancialData?.bpSummary,
        ...cleanHierarchySummary
      };
    } else if (rawData.rawFinancialData?.bpSummary && Object.keys(rawData.rawFinancialData.bpSummary).length > 0) {
      // Pre-computed summary passed directly from the page (BalanceSheetPage)
      bpSummary = rawData.rawFinancialData.bpSummary;
    }

    if (bpSummary && !bpSummary.exerciseYear) {
      bpSummary.exerciseYear = rawData.year;
    }

    // Attempt to extract Ebitda and Lucro Liquido if DRE exists
    const dreEbitda = rawData.rawFinancialData?.ebitda !== undefined
      ? rawData.rawFinancialData.ebitda
      : (hasDRE ? (rawData.dreData.find((r: any) => r.category === 'EBITDA' || r.id === 'EBITDA')?.value || 0) : 0);
    const dreLucro = rawData.rawFinancialData?.lucroLiquido !== undefined
      ? rawData.rawFinancialData.lucroLiquido
      : (hasDRE ? (rawData.dreData.find((r: any) => r.category === 'LUCRO LÍQUIDO DO EXERCÍCIO' || r.id === 'LUCRO_LIQ')?.value || 0) : 0);

    

    const metrics = calculateFinancialMetrics(bpSummary, dreEbitda, dreLucro, segment);
    const anosHistorico = rawData.historicalCyclesCount || 0;
    const identity = inferBusinessIdentity(segment, anosHistorico, bpSummary, undefined, undefined);
    const masterCausality = hasBP ? evaluateMasterCausality(bpSummary, metrics, identity) : undefined;
    const temporalCausality = masterCausality?.temporalIntelligence;

    // ── Score Engine: Cálculo Real a partir dos dados do BP ─────────────────
    // Cada dimensão é calculada a partir de índices financeiros reais.
    // Retorna 0 se não há dados; nunca retorna valor hardcoded.
    const calcScores = (bp: any, ebitda: number, lucroLiq: number) => {
      if (!bp || !bp.ativoTotal || bp.ativoTotal === 0) {
        return { financial: 0, operational: 0, governance: 0, structural: 0, composite: 0 };
      }

      const calibration = CalibrationEngine.getCalibration();
      const stressSens = calibration.stressPropagationSensitivity;
      const causalitySens = calibration.temporalCausalitySensitivity;

      const at = bp.ativoTotal || 0;
      const ac = bp.ativoCirculante || 0;
      const pc = bp.passivoCirculante || 0;
      const pt = bp.passivoTotal || 0;
      const pl = bp.patrimonioLiquido || 0;
      const cx = bp.caixaEquivalentes || 0;
      const est = bp.estoques || 0;

      // 1. Liquidez (peso calibrado) — Corrente, Seca (com inventoryPenaltyFactor), Imediata
      const liqCorrente = pc > 0 ? Math.min((ac / pc) * 45, 100) : 80;
      const adjustedEst = est * institutionalContext.scoreCalibrationRules.inventoryPenaltyFactor;
      const liqSec = pc > 0 ? Math.min((Math.max(ac - adjustedEst, 0) / pc) * 40, 100) : 70;
      const liqImediata = pc > 0 ? Math.min((cx / pc) * 15, 100) : 60;
      const scoreLiquidez = Math.min(liqCorrente * 0.5 + liqSec * 0.35 + liqImediata * 0.15, 100);

      // 2. Estrutura de Capital (peso calibrado) — Autonomia, qualidade endividamento
      const autonomia = at > 0 ? (pl / at) * 100 : 0; // % PL/Ativo
      const endivCP = pt > 0 ? (pc / pt) * 100 : 50; // % dívida no CP
      const scoreEstrutura = Math.min(
        Math.max(autonomia * 0.6, 0) + Math.max((100 - endivCP) * 0.4, 0),
        100
      );

      // 3. Capital de Giro (peso calibrado) — Equilíbrio NCG
      const ncg = ac - pc;
      const ncgRatio = at > 0 ? (ncg / at) * 100 : 0;
      const scoreCapGiro = Math.min(Math.max(50 + ncgRatio * 2, 0), 100);

      // 4. Solidez / Solvência (peso calibrado) — Cobertura passivo total pelo PL com lossPenaltyFactor e stressSens
      let coberturaPL = pt > 0 ? Math.min((pl / pt) * 100, 100) : 80;
      if (lucroLiq < 0) {
        coberturaPL = Math.max(coberturaPL - (Math.abs(lucroLiq) / (pl || 1)) * 10 * institutionalContext.scoreCalibrationRules.lossPenaltyFactor * stressSens, 0);
      }
      const scoreSolidez = Math.min(coberturaPL, 100);

      // 5. Evolução PL histórica (peso calibrado)
      const prevPl = rawData.rawFinancialData?.prevPl || 0;
      let scoreEvolucao = 60;
      if (prevPl > 0 && pl > 0) {
        const growthPct = ((pl - prevPl) / Math.abs(prevPl)) * 100;
        scoreEvolucao = Math.min(Math.max(50 + growthPct, 0), 100);
      } else if (pl > 0 && prevPl === 0) {
        scoreEvolucao = 65;
      }

      // Proporções de pesos calibradas pelo modelo de negócio e sensibilidade
      let evWeight = institutionalContext.scoreCalibrationRules.evolutionWeight;
      let profWeight = institutionalContext.scoreCalibrationRules.profitabilityWeight;

      if (causalitySens !== 1.0) {
        // Adjust evolution weight fiduciarily
        evWeight = Math.min(Math.max(evWeight * causalitySens, 0.05), 0.40);
        const remaining = 1.0 - evWeight;
        const defaultRemaining = 1.0 - institutionalContext.scoreCalibrationRules.evolutionWeight;
        const ratio = profWeight / (defaultRemaining || 1);
        profWeight = remaining * ratio;
      }

      const remainderWeight = 1.0 - evWeight - profWeight;
      const liqWeight = remainderWeight * 0.4;
      const estWeight = remainderWeight * 0.3;
      const giroWeight = remainderWeight * 0.3;

      const baseWeights = {
        liquidez: liqWeight,
        estrutura: estWeight,
        giro: giroWeight,
        solidez: profWeight,
        evolution: evWeight
      };

      const cycles = rawData.historicalCyclesCount || 1;
      const guard = LongitudinalIntelligenceGuard.evaluate(cycles);
      
      let finalWeights: any = baseWeights;
      if (guard.evolutionScoreHidden) {
        const recalibrated = LongitudinalIntelligenceGuard.recalibrateWeights(baseWeights as unknown as Record<string, number>);
        finalWeights = {
          liquidez: recalibrated.liquidez || 0,
          estrutura: recalibrated.estrutura || 0,
          giro: recalibrated.giro || 0,
          solidez: recalibrated.solidez || 0,
          evolution: 0
        };
        scoreEvolucao = 0; // Nullify evolution impact
      }

      const composite =
        scoreLiquidez * finalWeights.liquidez * 100 +
        scoreEstrutura * finalWeights.estrutura * 100 +
        scoreCapGiro * finalWeights.giro * 100 +
        scoreSolidez * finalWeights.solidez * 100 +
        scoreEvolucao * finalWeights.evolution * 100;

      let finalComposite = Math.round((composite / 100) * 10) / 10;
      let finalStructural = Math.round(scoreEstrutura);

      // Remover penalidade histórica: o score deve ser 100% fotográfico do exercício selecionado.
      // O histórico/tendência será avaliado em camadas próprias, não na nota principal.

      return {
        financial: Math.round(scoreLiquidez),
        operational: Math.round(scoreCapGiro),
        governance: Math.round(scoreSolidez),
        structural: finalStructural,
        composite: finalComposite
      };
    };

    const rawScores = calcScores(bpSummary, dreEbitda, dreLucro);
    const rawEvolutionScore = rawScores.composite; // Evolution score as fallback
    const prudencyOutput = InstitutionalPrudencyLayer.applyPrudency(rawScores, rawEvolutionScore, rawData);
    const scores = prudencyOutput.adjustedScores;

    // 3. Capital Structure Engine
    const capitalStructure = translateCapitalStructure(bpSummary, metrics);

    // 4. Causality Interpretation Engine
    const baseCausality = translateCausalityInterpretation(metrics, bpSummary, scores, identity);

    if (runtimeMode !== 'FULL_FINANCIAL_VIEW') {
      if (!baseCausality.event.includes('INSUFFICIENT_DATA')) {
        baseCausality.event = `Sinais de: ${baseCausality.event}`;
      }
      if (!baseCausality.rootCause.includes('INSUFFICIENT_DATA')) {
        baseCausality.rootCause = `Indícios apontam para: ${baseCausality.rootCause}`;
      }
      if (!baseCausality.strategicImpact.includes('INSUFFICIENT_DATA')) {
        baseCausality.strategicImpact = `Visão parcial aponta: ${baseCausality.strategicImpact}`;
      }
    }

    const rawCausality = baseCausality;

    // 5. Severity Modulator Engine
    const severity = translateSeverityModulation(bpSummary, metrics, segment, masterCausality, runtimeMode);

    // 6. Narrative Sanitizer for single year/first operational year or limited strategic confidence
    const sanitizeNarrative = (text: string): string => {
      if (!text) return text;
      let sanitized = text;
      
      // Remove raw tags completely
      sanitized = sanitized.replace(/\[INSUFFICIENT_DATA\]/g, '')
                           .replace(/\[NOT_APPLICABLE\]/g, '')
                           .replace(/\s{2,}/g, ' ')
                           .trim();

      if (!sanitized) return '';

      const isInitialOrLimited = 
        institutionalContext.institutionalMaturity.historicalSupportLevel === 'SINGLE_YEAR_ONLY' || 
        institutionalContext.institutionalMaturity.code === 'INITIAL_OPERATION' ||
        institutionalContext.confidence.strategicConfidence === 'LIMITED_CONTEXT' ||
        institutionalContext.confidence.strategicConfidence === 'UNVERIFIABLE';

      if (isInitialOrLimited) {
        sanitized = sanitized
          .replace(/proteção de market share/gi, 'foco em posicionamento inicial')
          .replace(/robustez operacional/gi, 'estruturação operacional')
          .replace(/estabilidade estrutural/gi, 'alinhamento estrutural inicial')
          .replace(/caixa livre para expansão/gi, 'preservação de caixa')
          .replace(/caixa livre/gi, 'saldo de caixa')
          .replace(/análise evolutiva/gi, 'diagnóstico estático');
      }
      return ExecutiveNarrativeSanitizer.sanitize(sanitized);
    };

    // 6. Advisory Engine
    const calibrationParams = CalibrationEngine.getCalibration();
    const verbosity = calibrationParams.advisoryVerbosity;
    const aggressiveness = calibrationParams.advisoryAggressiveness;

    const stageLabel = pt(institutionalContext.institutionalMaturity.label);
    const modelLabel = pt(institutionalContext.operationalModel.label);
    const growthLabel = pt(institutionalContext.growthPattern);

    // Usa o Harmonizer estrutural
    const execSummary = ExecutiveNarrativeHarmonizer.harmonize({
      businessStage: institutionalContext.institutionalMaturity.code,
      economicModel: institutionalContext.operationalModel.code,
      strategicConfidence: institutionalContext.confidence.strategicConfidence,
      historicalDensityRequirement: memoryProfile.historicalDensityRequirement,
      historicalCyclesCount: rawData.historicalCyclesCount || 0,
      growthPattern: institutionalContext.growthPattern,
      verbosity: verbosity,
      segmentCode: institutionalContext.operationalSegment.code as SegmentCode,
      stageLabel,
      modelLabel,
      memoryIgnoredRecommendations: memoryProfile.ignoredRecommendations,
      memoryRecurrencePatterns: memoryProfile.recurrencePatterns
    });

    const riskProfile = SegmentRiskProfileEngine.getRiskProfile(institutionalContext.operationalSegment.code as SegmentCode);
    let focusAreas = [...institutionalContext.recommendationBoundaries.focusAreas, ...riskProfile.strategicAlerts];
    if (memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
      if (memoryProfile.decisionPatterns.length > 0) {
        focusAreas.push(...memoryProfile.decisionPatterns);
      }
      if (memoryProfile.deteriorationSignals.length > 0) {
        focusAreas.push(...memoryProfile.deteriorationSignals);
      }
    }

    if (aggressiveness > 1.2) {
      focusAreas.push('Alavancagem estratégica e aumento de produtividade comercial para otimização acelerada.');
    } else if (aggressiveness < 0.8) {
      focusAreas.push('Preservação máxima de liquidez e suspensão preventiva de novos Capex operacionais.');
    }

    const categorizeAction = (actionText: string): string => {
      const lower = actionText.toLowerCase();
      if (lower.includes('caixa') || lower.includes('liquidez') || lower.includes('sobrevivência') || lower.includes('colapso') || lower.includes('corte')) return 'SURVIVAL';
      if (lower.includes('ponto de equilíbrio') || lower.includes('break-even') || lower.includes('estabilidade') || lower.includes('dívida') || lower.includes('renegocia')) return 'STABILIZATION';
      if (lower.includes('otimiza') || lower.includes('eficiência') || lower.includes('produtividade') || lower.includes('margem')) return 'OPTIMIZATION';
      return 'GROWTH';
    };

    if (focusAreas.length > 5) {
      focusAreas = focusAreas.slice(0, 5);
    }

    const lineageSummary = InstitutionalLineageTracer.traceAssertion(
      sanitizeNarrative(execSummary),
      hasBP ? ['DRE', 'BP'] : ['DRE']
    );

    let advisory = {
      executiveSummary: `${lineageSummary.text}\n\n${lineageSummary.lineage}`,
      actionMatrix: focusAreas.map(a => {
        const sanitized = sanitizeNarrative(a);
        return `[${categorizeAction(sanitized)}] ${sanitized}`;
      }),
      priorityFocus: sanitizeNarrative(focusAreas[0] || 'Foco em posicionamento inicial')
    };



    const causality = {
      ...rawCausality,
      event: sanitizeNarrative(rawCausality.event),
      rootCause: sanitizeNarrative(rawCausality.rootCause),
      financialPropagation: sanitizeNarrative(rawCausality.financialPropagation),
      absorptionCapacity: sanitizeNarrative(rawCausality.absorptionCapacity),
      strategicImpact: sanitizeNarrative(rawCausality.strategicImpact),
      insights: rawCausality.insights?.map((ins: any) => ({
        ...ins,
        text: sanitizeNarrative(ins.text)
      })) || []
    };

    // ── Integração Structural Capital (Phase 4) ─────────────────────────
    const structuralCapital = hasBP 
      ? StructuralCapitalOrchestrator.analyze(bpSummary, institutionalContext)
      : undefined;

    if (structuralCapital) {
      scores.composite = Math.max(
        Math.round((scores.composite + structuralCapital.scoreAdjustment) * 10) / 10,
        0
      );
      
      // Reordena o advisory com base nos riscos estruturais detectados
      advisory.actionMatrix = StructuralCapitalOrchestrator.reprioritizeAdvisory(
        structuralCapital,
        advisory.actionMatrix
      );
      
      // legacy field removed
    }

    // ── Decomposition: valores reais por dimensão ──────────────────────────
    const getSeverityColor = (v: number) =>
      v >= 75 ? 'emerald' : v >= 55 ? 'blue' : v >= 40 ? 'amber' : 'rose';

    const bp = bpSummary || {} as unknown;
    const at2 = bp.ativoTotal || 0;
    const ac2 = bp.ativoCirculante || 0;
    const pc2 = bp.passivoCirculante || 0;
    const pt2 = bp.passivoTotal || 0;
    const pl2 = bp.patrimonioLiquido || 0;
    const cx2 = bp.caixaEquivalentes || 0;
    const est2 = bp.estoques || 0;

    const liqCorr = pc2 > 0 ? ac2 / pc2 : 0;
    const liqSec = pc2 > 0 ? (ac2 - est2) / pc2 : 0;
    const liqImId = pc2 > 0 ? cx2 / pc2 : 0;
    const scoreLiq = Math.min(liqCorr * 45 * 0.5 + liqSec * 40 * 0.35 + liqImId * 15 * 0.15, 100);

    const autonomia2 = at2 > 0 ? (pl2 / at2) * 100 : 0;
    const endivCP2 = pt2 > 0 ? (pc2 / pt2) * 100 : 50;
    let scoreEstr = Math.min(Math.max(autonomia2 * 0.6, 0) + Math.max((100 - endivCP2) * 0.4, 0), 100);

    if (memoryProfile.historicalDensityRequirement === 'SUFFICIENT') {
      if (memoryProfile.recurrenceSeverity === 'CRITICAL_STRUCTURAL_RECURRENCE') {
        scoreEstr = Math.max(scoreEstr - 15, 0);
      } else if (memoryProfile.recurrenceSeverity === 'HIGH_RECURRENCE') {
        scoreEstr = Math.max(scoreEstr - 10, 0);
      } else if (memoryProfile.recurrenceSeverity === 'MODERATE_RECURRENCE') {
        scoreEstr = Math.max(scoreEstr - 5, 0);
      }
    }

    const ncg2 = ac2 - pc2;
    const scoreGiro = Math.min(Math.max(50 + (at2 > 0 ? (ncg2 / at2) * 100 * 2 : 0), 0), 100);

    const cobert2 = pt2 > 0 ? Math.min((pl2 / pt2) * 100, 100) : 80;
    const scoreSolid = Math.min(cobert2, 100);

    const prevPlDec = rawData.rawFinancialData?.prevPl || 0;
    let scoreEvol = 60;
    if (prevPlDec > 0 && pl2 > 0) {
      scoreEvol = Math.min(Math.max(50 + ((pl2 - prevPlDec) / Math.abs(prevPlDec)) * 100, 0), 100);
    } else if (pl2 > 0) {
      scoreEvol = 65;
    }

    const decomposition = at2 > 0 ? [
      {
        label: 'Liquidez (25%)',
        value: Math.round(scoreLiq),
        severityColor: getSeverityColor(scoreLiq),
        explanation: `Liquidez Corrente: ${liqCorr.toFixed(2)}x | Seca: ${liqSec.toFixed(2)}x | Imediata: ${liqImId.toFixed(2)}x`
      },
      {
        label: 'Estrutura (25%)',
        value: Math.round(scoreEstr),
        severityColor: getSeverityColor(scoreEstr),
        explanation: `Autonomia Financeira: ${autonomia2.toFixed(1)}% | Dívida CP/Total: ${endivCP2.toFixed(1)}%`
      },
      {
        label: 'Cap. Giro (20%)',
        value: Math.round(scoreGiro),
        severityColor: getSeverityColor(scoreGiro),
        explanation: `NCG: R$ ${ncg2.toLocaleString('pt-BR', { maximumFractionDigits: 0 })} | ${at2 > 0 ? ((ncg2 / at2) * 100).toFixed(1) : 0}% do Ativo Total`
      },
      {
        label: 'Solidez (20%)',
        value: Math.round(scoreSolid),
        severityColor: getSeverityColor(scoreSolid),
        explanation: `Cobertura do Passivo pelo PL: ${cobert2.toFixed(1)}%`
      },
      {
        label: 'Evolução (10%)',
        value: Math.round(scoreEvol),
        severityColor: getSeverityColor(scoreEvol),
        explanation: prevPlDec > 0
          ? `Variação YoY do PL: ${(((pl2 - prevPlDec) / Math.abs(prevPlDec)) * 100).toFixed(1)}%`
          : 'Sem histórico anterior disponível para comparação YoY'
      }
    ] : [];

    // ── DRE Real Metrics Engine ────────────────────────────────────────────────
    // When dreData is present, compute ALL real financial metrics via the cascade engine.
    const normStr = (s: string) => 
      (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/^[0-9.]+\s*[-]\s*/, '').replace(/^[()=/\-+.\s]+|[()=/\-+.\s]+$/g, '').trim();

    const filtYear = Number(rawData.rawFinancialData?.filterYear || new Date().getFullYear());
    const allHistData = rawData.rawFinancialData?.allHistoryData || [];

    const isOfficialDfcAvailable = allHistData.some((d: any) => {
      const t = normStr(d.type || '');
      const dt = normStr(d.docType || '');
      const isDfc = t === 'dfc' || dt === 'dfc' || dt === 'dfc contabil' || t === 'dfc contabil' || t === 'demonstracao dos fluxos de caixa' || dt === 'demonstracao dos fluxos de caixa';
      return Number(d.year) === filtYear && isDfc;
    });

    const buildDreMetricsPayload = () => {
      if (!hasDRE || !rawData.dreData || rawData.dreData.length === 0) {
        return {
          hasData: false,
          financialMetrics: {
            receitaBruta: 0, deducoesReceita: 0, recLiquida: 0, custosVar: 0, margemContrib: 0,
            despesasFixas: 0, pontoEquilibrio: 0, gapEquilibrio: 0, margemSegurancaValor: 0,
            indiceDeducoes: 0, indiceCoberturaOperacional: 0, indiceMargemContrib: 0, cmvLabel: 'Custos Variáveis',
            cascadeResult: [],
          },
          kpis: [],
          efficiencies: [
            { name: 'Comercial', value: 0, desc: 'Gestão de Custos', color: 'slate' },
            { name: 'Operacional', value: 0, desc: 'Geração EBITDA', color: 'slate' }
          ],
          scaleEfficiency: { category: 'Sem Dados', colorClass: 'text-muted-foreground', recGrowth: 0, ebitdaGrowth: 0, description: 'Aguardando dados financeiros.' },
          alerts: [],
          chartData: []
        };
      }

      const dreRawData = rawData.dreData;
      const filterYear = rawData.rawFinancialData?.filterYear || new Date().getFullYear();
      const segmentoEmpresa = (rawData.rawFinancialData?.segmentoEmpresa || 'Serviços').toLowerCase();

      // Map entries to the cascade format (same logic as LegacyDREAdapter)
      const yearEntries = dreRawData.filter((d: any) => {
        const et = (d.entryType || '').toLowerCase();
        return et !== 'ativo' && et !== 'passivo' && et !== 'patrimônio líquido';
      });

      const mappedEntries = yearEntries
        .sort((a: any, b: any) => (a.ordem || 0) - (b.ordem || 0))
        .map((d: any) => {
          let parentId = d.parentId;
          const cat = (d.conta || d.category || '').toLowerCase();

          // Skip calculated totals from legacy flat data OR explicit SINTETICA rows to prevent double-counting
          if (d.dreTipo === 'SINTETICA' || d.dreTipo === 'RESULTADO_CALCULADO') return null;
          if (!parentId && (
            cat.includes('receita líquida') || cat.includes('receita operacional líquida') ||
            cat.includes('lucro bruto') || cat.includes('ebitda') || cat === 'ebit' ||
            cat.includes('resultado operacional líquido') || cat.includes('lajida') ||
            cat.includes('lucro líquido') || cat.includes('lair') || cat.includes('resultado antes')
          )) return null;

          if (!parentId) {
            if (cat.includes('receita operacional bruta') || cat === 'receita bruta' || cat.includes('faturamento') || (cat.includes('venda') && !cat.includes('despesa') && !cat.includes('custo') && !cat.includes('imposto')) ||
               (cat.includes('receita') && !cat.includes('líquida') && !cat.includes('financeir') && !cat.includes('outras'))) {
              parentId = 'ROB';
            } else if (cat.includes('deduç') || cat.includes('imposto sobre') || cat.includes('abatimento') || cat.includes('devoluç') || cat.includes('cancelamento')) {
              parentId = 'DED';
            } else if (cat.includes('custo') || cat.includes('cmv') || cat.includes('cpv') || cat.includes('csv') || cat.includes('csp')) {
              parentId = 'CUSTOS';
            } else if (cat.includes('deprecia') || cat.includes('amortiza')) {
              parentId = 'DEP_AMORT';
            } else if (cat.includes('financeir') || cat.includes('juros')) {
              parentId = 'RESULT_FIN';
            } else if (cat.includes('provisão') || cat.includes('irpj') || cat.includes('csll') || cat.includes('imposto de renda') || cat.includes('contribuição social')) {
              parentId = 'PROV_IR_CSLL';
            } else if (cat.includes('outras receitas') || cat.includes('outra receita') || cat.includes('outras despesas operacionais')) {
              parentId = 'OUTRAS_REC_DESP';
            } else {
              parentId = 'DESP_OPER';
            }
          }
          return { ...d, parentId, value: d.val || d.valor || d.value || 0 };
        })
        .filter(Boolean);

      const allRows = [
        ...DRE_OFFICIAL_STRUCTURE.map((account: any) => ({ ...account, value: 0 })),
        ...mappedEntries
      ];

      const cascadeResult = calculateDreCascade(allRows);

      const getV = (id: string) => {
        const row = cascadeResult.find((r: any) => r.id === id);
        if (!row) return 0;
        return row.computedValue !== undefined ? row.computedValue : (row.val || row.value || 0);
      };

      const receitaBruta    = getV('ROB');
      const deducoesReceita = getV('DED');
      const recLiquida      = getV('ROL');
      const custosVar       = getV('CUSTOS');
      const lucroBruto      = getV('LUCRO_BRUTO');
      const despesasFixas   = getV('DESP_OPER');
      const ebitda          = getV('EBITDA');
      const depreciacao     = getV('DEP_AMORT');
      const ebitVal         = getV('EBIT');
      const despFin         = getV('RESULT_FIN');
      const provisaoIR      = getV('PROV_IR_CSLL');
      const lucroLiq        = getV('LUCRO_LIQ');

      const cmvRow = cascadeResult.find((r: any) => r.parentId === 'CUSTOS' && r.tipo !== 'SINTETICA') ||
                     cascadeResult.find((r: any) => r.id === 'CUSTOS');
      const cmvLabelRaw = cmvRow ? (cmvRow.conta || cmvRow.category || cmvRow.nome || 'Custos Variáveis') : 'Custos Variáveis';
      const cmvLabel = cmvLabelRaw.replace(/^[(-/+)\s]+/, '').trim();

      const margemContrib     = lucroBruto;
      const indiceMargemContrib = recLiquida > 0 ? margemContrib / recLiquida : 0;
      const indiceDeducoes    = receitaBruta > 0 ? (deducoesReceita / receitaBruta) * 100 : 0;

      let pontoEquilibrio = 0;
      if (indiceMargemContrib > 0) pontoEquilibrio = Math.abs(despesasFixas) / indiceMargemContrib;
      if (!isFinite(pontoEquilibrio)) pontoEquilibrio = 0;

      const gapEquilibrio         = pontoEquilibrio - recLiquida;
      const margemSegurancaValor  = recLiquida > pontoEquilibrio ? recLiquida - pontoEquilibrio : -gapEquilibrio;
      const indiceCoberturaOperacional = pontoEquilibrio > 0 ? (recLiquida / pontoEquilibrio) * 100 : 0;

      const mbVal             = recLiquida > 0 ? (lucroBruto / recLiquida) * 100 : 0;
      const cmvVal            = recLiquida > 0 ? (custosVar / recLiquida) * 100 : 0;
      const ebitdaVal         = recLiquida > 0 ? (ebitda / recLiquida) * 100 : 0;
      const margemOperacional = recLiquida !== 0 ? (ebitVal / recLiquida) * 100 : 0;
      const margemLiquida     = recLiquida !== 0 ? (lucroLiq / recLiquida) * 100 : 0;
      const capacidadeAbsorcaoEstrutura = despesasFixas > 0 ? margemContrib / despesasFixas : margemContrib > 0 ? Infinity : 0;
      const indiceConversaoOperacional  = lucroBruto !== 0 ? (ebitVal / lucroBruto) * 100 : 0;
      const receitaMediaDiaria = recLiquida / 360;
      const breakEvenDays     = receitaMediaDiaria > 0 ? pontoEquilibrio / receitaMediaDiaria : 0;

      const despVendas = cascadeResult
        .filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('venda'))
        .reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);
      const despAdmin = cascadeResult
        .filter((r: any) => r.parentId === 'DESP_OPER' && (r.conta || r.category || r.nome || '').toLowerCase().includes('admin'))
        .reduce((a: any, b: any) => a + (b.computedValue || b.value || b.val || 0), 0);

      const indiceDespesasAdministrativas = recLiquida > 0 ? (despAdmin / recLiquida) * 100 : 0;
      const indiceDespesasComerciais      = recLiquida > 0 ? (despVendas / recLiquida) * 100 : 0;
      const indiceDespesasFinanceiras     = recLiquida > 0 ? (despFin / recLiquida) * 100 : 0;

      // Resolve benchmarks via BenchmarkReferenceEngine
      const economicModelName = pt(institutionalContext.operationalModel.label);
      const benchComercial = BenchmarkReferenceEngine.resolve('cmvVal', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchOperacional = BenchmarkReferenceEngine.resolve('ebitdaVal', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchAdministrativa = BenchmarkReferenceEngine.resolve('despAdmin', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchFinanceira = BenchmarkReferenceEngine.resolve('despFin', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchTributaria = BenchmarkReferenceEngine.resolve('burdenTributario', segmentoEmpresa, economicModelName, rawData.clientConfig);
      const benchEstrutural = BenchmarkReferenceEngine.resolve('capacidadeAbsorcao', segmentoEmpresa, economicModelName, rawData.clientConfig);

      const targetCmvMax = benchComercial.target;
      const targetEbitdaMin = benchOperacional.target;
      const targetAdminMax = benchAdministrativa.target;
      const targetFinMax = benchFinanceira.target;
      const targetTribMax = benchTributaria.target;
      const targetAbsorcaoMin = benchEstrutural.target;

      let cmvMax = targetCmvMax || 60;
      let cmvCritical = 75;

      const burdenTributario = receitaBruta > 0 ? (deducoesReceita + Math.abs(provisaoIR)) / receitaBruta : 0;
      const burdenTributarioPerc = burdenTributario * 100;

      const calcScore = (real: number, target: number, isLowerBetter: boolean) => {
        if (target === 0) return 100;
        if (isLowerBetter) {
          return real <= target ? 100 : Math.max(100 - (((real - target) / target) * 100), 0);
        } else {
          return real >= target ? 100 : Math.max((real / target) * 100, 0);
        }
      };

      const eficienciaComercial  = calcScore(cmvVal, targetCmvMax, true);
      const eficienciaOperacional= calcScore(ebitdaVal, targetEbitdaMin, false);
      const eficienciaAdministrativa = calcScore(indiceDespesasAdministrativas, targetAdminMax, true);
      const eficienciaFinanceira = calcScore(indiceDespesasFinanceiras, targetFinMax, true);
      const eficienciaTributaria = calcScore(burdenTributarioPerc, targetTribMax, true);
      const eficienciaEstrutural = calcScore(capacidadeAbsorcaoEstrutura, targetAbsorcaoMin, false);

      // Chart data (historical trend)
      const allHistoryData = Array.isArray(rawData.historicalSeries) && rawData.historicalSeries.length > 0 
        ? rawData.historicalSeries 
        : dreRawData;
      const chartData = [5, 4, 3, 2, 1, 0].map(offset => {
        const y = filterYear - offset;
        const yearHist = allHistoryData.filter((d: any) =>
          Number(d.year) === y && (d.type === 'DRE' || !d.type) &&
          (d.entryType || '').toLowerCase() !== 'ativo' &&
          (d.entryType || '').toLowerCase() !== 'passivo'
        );
        let rl = 0, ebt = 0, ll = 0, cmv = 0;
        if (yearHist.length > 0) {
          const m = yearHist.map((d: any) => ({ ...d, value: d.val || d.valor || d.value || 0 }));
          const res = calculateDreCascade([...DRE_OFFICIAL_STRUCTURE.map((a: any) => ({ ...a, value: 0 })), ...m]);
          rl  = res.find((r: any) => r.id === 'ROL')?.computedValue || 0;
          ebt = res.find((r: any) => r.id === 'EBITDA')?.computedValue || 0;
          ll  = res.find((r: any) => r.id === 'LUCRO_LIQ')?.computedValue || 0;
          cmv = Math.abs(res.find((r: any) => r.id === 'CUSTOS')?.computedValue || 0);
        }
        return { year: y.toString(), receita: rl, cmv, ebitda: ebt, lucro: ll };
      }).filter((d: any) => d.receita > 0 || d.ebitda > 0 || d.lucro > 0 || d.cmv > 0 || d.year === filterYear.toString());

      // Scale efficiency & trend
      let recGrowth = 0, ebitdaGrowth = 0, trendNote: any = null;
      if (chartData.length >= 2) {
        const current = chartData[chartData.length - 1];
        const oldest  = chartData.find((d: any) => d.receita > 0) || chartData[0];
        if (oldest && oldest.year !== current.year) {
          recGrowth    = oldest.receita  !== 0 ? ((current.receita  / oldest.receita)  - 1) * 100 : 0;
          ebitdaGrowth = oldest.ebitda   !== 0 ? ((current.ebitda   / oldest.ebitda)   - 1) * 100 : 0;
          const cmvGrowth   = oldest.cmv   !== 0 ? ((current.cmv   / oldest.cmv)   - 1) * 100 : 0;
          const lucroGrowth = oldest.lucro !== 0 ? ((current.lucro / oldest.lucro) - 1) * 100 : 0;
          trendNote = { period: `${oldest.year} a ${current.year}`, receita: recGrowth, ebitda: ebitdaGrowth, cmv: cmvGrowth, lucro: lucroGrowth };
        }
      }

      // DRE Insights (alerts + smart insights)
      const internalAuditErrors: string[] = [];
      if (recLiquida !== 0) {
        const calcLB = recLiquida - Math.abs(custosVar);
        if (lucroBruto !== 0 && Math.abs(calcLB - lucroBruto) > (Math.abs(recLiquida) * 0.01)) {
          internalAuditErrors.push('Divergência matemática detectada: Lucro Bruto.');
        }
      }

      const receitaPorOpex = despesasFixas > 0 ? recLiquida / despesasFixas : 0;

      const dreMetrics: DreMetrics = {
        recLiquida, lucroBruto, pontoEquilibrio, gapEquilibrio, indiceCoberturaOperacional,
        margemSegurancaValor, cmvVal, cmvCritical, cmvLabel, capacidadeAbsorcaoEstrutura,
        margemOperacional, margemLiquida, indiceDespesasAdministrativas, indiceDespesasFinanceiras,
        breakEvenDays, indiceConversaoOperacional, ebitda, recGrowth, ebitdaGrowth, internalAuditErrors,
        margemContrib, receitaPorOpex
      };
      const dreInsights = generateDreInsights(dreMetrics);

      // Run new Engines (Governance / Economic Intelligence)
      const qualityReport = ExecutiveEconomicQualityEngine.evaluate(
        recLiquida, lucroBruto, ebitda, lucroLiq, pontoEquilibrio, despesasFixas, rawData.historicalCyclesCount || 1
      );
      
      const rootCauseReport = EBITDARootCauseEngine.evaluate(
        recLiquida, lucroBruto, ebitda, despesasFixas, pontoEquilibrio
      );

      const economicValueAssessment = EconomicValueIntelligenceEngine.evaluate(
        recLiquida, lucroLiq, ebitda, pontoEquilibrio
      );

      const earningsQualityAssessment = EarningsCompositionEngine.evaluate(
        recLiquida, 
        getV('OUTRAS_REC_DESP'), 
        despFin, 
        lucroLiq, 
        lucroBruto, 
        false // We could pass isChartOfAccountsSimplified here, assuming false for now unless we have that info
      );

      const confidenceAssessment = InstitutionalConfidenceEngine.evaluate(
        hasBP, 
        isOfficialDfcAvailable, 
        rawData.historicalCyclesCount || 1, 
        false, 
        internalAuditErrors.length > 0
      );
      const managementDiscussion = ManagementDiscussionAnalysisEngine.evaluate(
        recLiquida, lucroLiq, ebitda, pontoEquilibrio, despesasFixas, recGrowth, ebitdaGrowth, advisory.actionMatrix, hasBP ? ['DRE', 'BP'] : ['DRE']
      );

      const dreContext: ExecutiveAnalysisContext = {
        analysisYear: new Date().getFullYear(), generatedAt: new Date().toISOString(), moduleContext: 'DRE',
        activeFiduciaryRestrictions: [],
        fiduciaryClassification: '', // Will be updated
        mathematicalClassification: '', // Will be updated
        globalScore: 50,
        primaryIndicators: {},
        technicalDrivers: {
          netRevenue: recLiquida,
          grossMargin: lucroBruto / recLiquida,
          netProfit: lucroLiq,
          ebitda: ebitda
        },
        contextualAlerts: []
      };

      const executiveInterpretation = DREExecutiveInterpretationEngine.evaluate({
        economicValueInput: { receitaLiquida: recLiquida, lucroBruto, ebitda, lucroLiquido: lucroLiq, despesasFixas },
        recoverabilityInput: { receitaLiquida: recLiquida, lucroBruto, pontoEquilibrio, ebitda },
        recGrowth,
        context: dreContext
      });

      // --- DRE EXECUTIVE LAYER BINDING FIX ---
      const mappedData = DREExecutiveDataMapper.map({
        netRevenue: recLiquida,
        cogs: custosVar,
        adminExpenses: despAdmin,
        ebitda: ebitda,
        netProfit: lucroLiq,
        breakEvenRevenue: pontoEquilibrio,
        grossProfit: lucroBruto
      });

      const normalizedDRE = mappedData.executiveMetrics;
      

      const revenueEconomicStructure = RevenueEconomicStructureEngine.evaluate(normalizedDRE);
      const economicBurnRate = EconomicBurnRateEngine.evaluate(normalizedDRE);
      const breakEvenAnalysis = BreakEvenAnalysisEngine.evaluate(normalizedDRE);
      const operationalAbsorption = OperationalAbsorptionEngine.evaluate(normalizedDRE);

      const economicDiagnosis = EconomicDiagnosisEngine.evaluate({
        normalizedDRE,
        revenueEconomicStructure,
        breakEvenAnalysis,
        operationalAbsorption,
        economicBurnRate
      });

      // Update DRE context with calculated diagnosis values
      dreContext.fiduciaryClassification = economicDiagnosis.recoverabilityAssessment;
      dreContext.mathematicalClassification = economicDiagnosis.valueCreationAssessment === 'Sim' ? 'RESILIENT' : 'ATTENTION';

      // ENGF v1.0 — Compressed Executive Advisory (replaces dual Síntese + Sumário)
      const dreExecutiveAdvisoryFull = DREBoardAdvisoryEngine.generateExecutiveAdvisory(normalizedDRE, economicDiagnosis, dreContext);
      const dreBoardAdvisory = dreExecutiveAdvisoryFull.fullNarrative;

      // Board Decision Framework with 7 fiduciary questions
      const dreBoardDecisionSupport = DREBoardDecisionSupportEngine.generateFramework(
        economicDiagnosis,
        {
          breakEvenGap: breakEvenAnalysis.available ? breakEvenAnalysis.value.breakEvenGap : undefined,
          netRevenue: normalizedDRE.netRevenue.value,
          breakEvenRevenue: breakEvenAnalysis.available ? breakEvenAnalysis.value.breakEvenRevenue : undefined,
        },
        dreContext
      );

      // Health Score Explainability (ENGF v1.0)
      const healthExplainability = OperationalHealthExplainabilityEngine.explain(
        Math.round(Math.min(Math.max(0, 0), 100)), // placeholder — will be overridden after score calc
        {
          ebitda,
          breakEvenCoverage: breakEvenAnalysis.available ? breakEvenAnalysis.value.breakEvenCoverage : 0,
          grossMargin: normalizedDRE.grossMargin.value,
          netProfit: lucroLiq,
          adminExpenses: despAdmin,
          netRevenue: recLiquida
        }
      );

      // Cross-statement isolation audit
      const dreIsolationAudit = CrossStatementIsolationValidator.validateDRERecommendation(dreBoardAdvisory);

      // Existing assignments to dreInsights for backward compatibility (but overridden by new ones)
      (dreInsights as any).qualityReport = qualityReport;
      (dreInsights as any).rootCauseReport = rootCauseReport;
      (dreInsights as any).economicValueAssessment = economicValueAssessment;
      (dreInsights as any).earningsQualityAssessment = earningsQualityAssessment;
      (dreInsights as any).confidenceAssessment = confidenceAssessment;
      (dreInsights as any).managementDiscussion = managementDiscussion;
      (dreInsights as any).executiveInterpretation = executiveInterpretation;
      
      // New executive properties
      (dreInsights as any).normalizedDRE = normalizedDRE;
      (dreInsights as any).revenueEconomicStructure = revenueEconomicStructure;
      (dreInsights as any).economicBurnRate = economicBurnRate;
      (dreInsights as any).breakEvenAnalysis = breakEvenAnalysis;
      (dreInsights as any).operationalAbsorption = operationalAbsorption;
      (dreInsights as any).economicDiagnosis = economicDiagnosis;
      (dreInsights as any).dreExecutiveAdvisory = dreBoardAdvisory;
      (dreInsights as any).dreExecutiveAdvisoryFull = dreExecutiveAdvisoryFull;
      (dreInsights as any).dreBoardDecisionSupport = dreBoardDecisionSupport;
      (dreInsights as any).healthExplainability = healthExplainability;
      (dreInsights as any).dreIsolationAudit = dreIsolationAudit;
      (dreInsights as any).dreBindingAudit = DREExecutiveBindingAudit.audit({
        revenueEconomicStructure,
        economicBurnRate,
        breakEvenAnalysis,
        operationalAbsorption
      });

      // KPIs
      const rawKpis = recLiquida > 0 ? [
        { name: 'Receita Líquida',       val: recLiquida,          unit: 'currency', status: 'Verde' as const,    trend: 'Operacional',    tooltip: 'Receita após deduções e impostos sobre vendas.' },
        { name: 'EBITDA',                val: ebitda,              unit: 'currency', status: ebitda >= 0 ? 'Verde' as const : 'Vermelho' as const, trend: ebitda >= 0 ? 'Positivo' : 'Negativo', tooltip: 'Geração de caixa operacional antes de juros, IR, depreciação e amortização.' },
        { name: 'Lucro Líquido',         val: lucroLiq,            unit: 'currency', status: lucroLiq >= 0 ? 'Verde' as const : 'Vermelho' as const, trend: lucroLiq >= 0 ? 'Lucrativo' : 'Prejuízo', tooltip: 'Resultado líquido após todos os custos, despesas e impostos.' },
        { name: 'Margem de Contribuição',val: margemContrib,       unit: 'currency', status: mbVal >= 40 ? 'Verde' as const : mbVal >= 25 ? 'Amarelo' as const : 'Vermelho' as const, trend: 'Margem de Contribuição / Receita Líquida', tooltip: 'Receita Líquida - Custos Variáveis. Indica a sobra para pagar custos fixos.' },
        { name: 'Margem EBITDA',         val: ebitdaVal,           unit: '%',        status: ebitdaVal >= 15 ? 'Verde' as const : ebitdaVal >= 8 ? 'Amarelo' as const : 'Vermelho' as const, trend: 'EBITDA / ROL', tooltip: 'Percentual da receita líquida convertido em EBITDA.' },
        { name: 'Distância para o Ponto de Equilíbrio',val: breakEvenAnalysis.available ? breakEvenAnalysis.value.breakEvenGap : 0, unit: 'currency', status: (breakEvenAnalysis.available && breakEvenAnalysis.value.breakEvenGap <= 0) ? 'Verde' as const : 'Vermelho' as const, trend: 'Distância para o Ponto de Equilíbrio', tooltip: 'Ponto de Equilíbrio - Receita Líquida.' },
        { name: 'Índice de Cobertura do Ponto de Equilíbrio',   val: indiceCoberturaOperacional, unit: '%', status: indiceCoberturaOperacional >= 100 ? 'Verde' as const : indiceCoberturaOperacional >= 85 ? 'Amarelo' as const : 'Vermelho' as const, trend: 'Cobertura do Ponto de Equilíbrio', tooltip: 'Quanto da receita atual cobre o ponto de equilíbrio.' }
      ] : [];
      const kpis = rawKpis.map(k => KPISemanticIntelligenceEngine.enrich(k, segment));

      // Scale efficiency classification
      let scaleCategory = 'Análise Inicial';
      let scaleColorClass = 'text-muted-foreground';
      if (recGrowth > 0 && ebitdaGrowth > recGrowth)       { scaleCategory = 'Crescimento Saudável';    scaleColorClass = 'text-emerald-500'; }
      else if (recGrowth > 0 && ebitdaGrowth > 0)          { scaleCategory = 'Absorção de Estrutura';   scaleColorClass = 'text-blue-500'; }
      else if (recGrowth > 0 && ebitdaGrowth < 0)          { scaleCategory = 'Crescimento Destrutivo';  scaleColorClass = 'text-rose-500'; }
      else if (recGrowth <= 0 && ebitdaGrowth < 0)         { scaleCategory = 'Destruição de Valor';     scaleColorClass = 'text-red-600'; }
      else if (recGrowth < 0 && ebitdaGrowth > 0)          { scaleCategory = 'Eficiência sob Retração'; scaleColorClass = 'text-amber-500'; }

      // DRE Health Score (same algorithm as LegacyDREAdapter)
      let dreHealthScoreBase = 0;
      if (recLiquida > 0) {
        const scoreMargemBruta   = Math.min(Math.max((mbVal / 40) * 100, 0), 100) * 0.15;
        let scoreCMV = 0;
        if (cmvVal <= cmvMax) scoreCMV = 100;
        else if (cmvVal >= cmvCritical) scoreCMV = 0;
        else scoreCMV = 100 - (((cmvVal - cmvMax) / (cmvCritical - cmvMax)) * 100);
        scoreCMV *= 0.10;
        const scoreMargemEbitda  = Math.min(Math.max((ebitdaVal / 15) * 100, 0), 100) * 0.15;
        const scoreMargemOp      = Math.min(Math.max(((margemOperacional + 10) / 25) * 100, 0), 100) * 0.15;
        const scoreCobertura     = Math.min(Math.max((indiceCoberturaOperacional / 100) * 100, 0), 100) * 0.15;
        const scoreEstrut        = Math.min(Math.max(capacidadeAbsorcaoEstrutura * 100, 0), 100) * 0.10;
        const scoreCaixa         = Math.min(Math.max((indiceConversaoOperacional / 80) * 100, 0), 100) * 0.10;
        const debtRatio          = ebitda > 0 ? despFin / ebitda : despFin > 0 ? 1 : 0;
        const scoreDivida        = Math.max((1 - debtRatio) * 100, 0) * 0.10;
        dreHealthScoreBase = scoreMargemBruta + scoreCMV + scoreMargemEbitda + scoreMargemOp + scoreCobertura + scoreEstrut + scoreCaixa + scoreDivida;
        if (mbVal > 30 && capacidadeAbsorcaoEstrutura < 1) dreHealthScoreBase += 10;
        if (trendNote && trendNote.receita > 0) dreHealthScoreBase += Math.min((trendNote.receita / 20) * 10, 10);
        if (ebitda < 0 || margemOperacional < 0 || recLiquida < pontoEquilibrio) dreHealthScoreBase = Math.min(dreHealthScoreBase, 40);
      }
      const dreHealthScore = Math.round(Math.min(Math.max(dreHealthScoreBase, 0), 100));

      return {
        hasData: true,
        financialMetrics: {
          cascadeResult,
          receitaBruta, deducoesReceita, recLiquida, custosVar, margemContrib,
          despesasFixas, pontoEquilibrio, gapEquilibrio, margemSegurancaValor,
          indiceDeducoes, indiceCoberturaOperacional, indiceMargemContrib,
          cmvLabel, mbVal, cmvVal, ebitdaVal, margemOperacional, margemLiquida,
          indiceConversaoOperacional, capacidadeAbsorcaoEstrutura, breakEvenDays,
          trendNote, dreHealthScore,
        },
        kpis,
        efficiencies: [
          { name: 'Comercial',      value: mbVal,                     score: eficienciaComercial,      desc: `Margem Bruta (Meta: >${(100 - targetCmvMax).toFixed(0)}%) — ${benchComercial.label}`, color: eficienciaComercial >= 80 ? 'emerald' : eficienciaComercial >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Operacional',    value: ebitdaVal,                 score: eficienciaOperacional,    desc: `Margem EBITDA (Meta: >${targetEbitdaMin}%) — ${benchOperacional.label}`, color: eficienciaOperacional >= 80 ? 'emerald' : eficienciaOperacional >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Administrativa', value: indiceDespesasAdministrativas, score: eficienciaAdministrativa, desc: `Desp. Adm/ROL (Meta: <${targetAdminMax}%) — ${benchAdministrativa.label}`,  color: eficienciaAdministrativa >= 80 ? 'emerald' : eficienciaAdministrativa >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Financeira',     value: indiceDespesasFinanceiras, score: eficienciaFinanceira,     desc: `Desp. Fin/ROL (Meta: <${targetFinMax}%) — ${benchFinanceira.label}`,    color: eficienciaFinanceira >= 80 ? 'emerald' : eficienciaFinanceira >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Tributária',     value: burdenTributarioPerc,      score: eficienciaTributaria,     desc: `Carga Tributária (Meta: <${targetTribMax}%) — ${benchTributaria.label}`,   color: eficienciaTributaria >= 80 ? 'emerald' : eficienciaTributaria >= 50 ? 'amber' : 'rose', unit: '%' },
          { name: 'Estrutural',     value: capacidadeAbsorcaoEstrutura, score: eficienciaEstrutural,   desc: `Absorção Estrutura (Meta: >${targetAbsorcaoMin}x) — ${benchEstrutural.label}`, color: eficienciaEstrutural >= 80 ? 'emerald' : eficienciaEstrutural >= 50 ? 'amber' : 'rose', unit: 'x' },
        ],
        scaleEfficiency: {
          category: scaleCategory,
          colorClass: scaleColorClass,
          recGrowth,
          ebitdaGrowth,
          description: dreInsights.performanceNote
        },
        alerts: dreInsights.systemAlerts as { type: "warning" | "danger", msg: string }[],
        chartData,
        dreInsights: {
          ...dreInsights as any,
          healthExplainability: OperationalHealthExplainabilityEngine.explain(
            dreHealthScore,
            {
              ebitda,
              breakEvenCoverage: breakEvenAnalysis.available ? breakEvenAnalysis.value.breakEvenCoverage : 0,
              grossMargin: normalizedDRE.grossMargin.value,
              netProfit: lucroLiq,
              adminExpenses: despAdmin,
              netRevenue: recLiquida
            }
          )
        }
      };
    };

    const metricsPayload = buildDreMetricsPayload();


    const dfcDataForRuntime = (rawData.dfcDataForRuntime && rawData.dfcDataForRuntime.length > 0) 
      ? rawData.dfcDataForRuntime 
      : ((rawData.dfcData && rawData.dfcData.length > 0)
        ? rawData.dfcData
        : (isOfficialDfcAvailable ? allHistData.filter((d: any) => {
            const t = normStr(d.type || '');
            const dt = normStr(d.docType || '');
            const isDfc = t === 'dfc' || dt === 'dfc' || dt === 'dfc contabil' || t === 'dfc contabil' || t === 'demonstracao dos fluxos de caixa' || dt === 'demonstracao dos fluxos de caixa';
            return Number(d.year) === filtYear && isDfc;
          }) : []));

    // Process DFC (Trilha 1) - Legacy Adapter
     
    const rawCashFlow = CashFlowAdapter.process(
      dfcDataForRuntime,
      dreEbitda,
      0 || 0,
      0 || 0,
      0 || 0,
      bpSummary?.caixaEquivalentes || 0,
      0 || 0,
      0 || 0
    );
    const cashFlowReport: ConsolidatedCashFlowReport = {
      isAvailable: rawCashFlow.diagnostics.isAvailable,
      overallNarrative: rawCashFlow.narrative,
      operational: rawCashFlow.diagnostics.operational,
      conversion: rawCashFlow.diagnostics.conversion,
      treasury: rawCashFlow.diagnostics.treasury,
      sustainability: rawCashFlow.diagnostics.sustainability,
      funding: rawCashFlow.diagnostics.funding
    };
    // Process DFC (Trilha Fiduciária 1.5) - Novo Padrão Cash Intelligence
    let fco = 0;
    let fci = 0;
    let fcf = 0;

    const getDfcVal = (entries: any[], keywords: string[]) => {
      const matches = entries.filter((s:any) => {
        const name = normStr(s?.conta || s?.category || s?.name || '');
        return keywords.some(k => name.includes(k));
      });
      
      if (matches.length === 0) return 0;
      if (matches.length === 1) {
        return matches[0]?.val || matches[0]?.valor || matches[0]?.value || 0;
      }
      
      const totalMatch = matches.find((s:any) => {
        const name = normStr(s?.conta || s?.category || s?.name || '');
        return name.includes('total') || name.includes('liquido') || name.includes('fluxo de caixa das') || name === 'fco' || name === 'fci' || name === 'fcf';
      });
      
      if (totalMatch) {
        return totalMatch?.val || totalMatch?.valor || totalMatch?.value || 0;
      }
      
      return matches.reduce((acc, curr) => acc + (curr?.val || curr?.valor || curr?.value || 0), 0);
    };

    const getHistValue = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistData.filter((d: any) => 
        Number(d.year) === y && docTypes.some(t => normStr(d.type || '') === normStr(t))
      );
      const normalizedFilters = nameFilters.map(normStr);
      const match = yearEntries.find((d: any) => {
        const c = normStr(d.conta || d.category || d.name || '');
        return normalizedFilters.some(n => c === n || c.includes(n));
      });
      return match?.val || match?.valor || match?.value || 0;
    };

    const getHistSum = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistData.filter((d: any) => 
        Number(d.year) === y && docTypes.some(t => normStr(d.type || '') === normStr(t))
      );
      let sum = 0;
      const normalizedFilters = nameFilters.map(normStr);
      yearEntries.forEach((d: any) => {
        const c = normStr(d.conta || d.category || d.name || '');
        if (normalizedFilters.some(n => c === n || c.includes(n))) {
          sum += (d.val || d.valor || d.value || 0);
        }
      });
      return sum;
    };

    const depreciacaoDre = Math.abs(getHistSum(filtYear, ['dre', 'resultado'], ['depreciacao', 'amortizacao']));

    const clientesAtual = getHistSum(filtYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
    const clientesAnt = getHistSum(filtYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['clientes', 'contas a receber', 'duplicatas a receber', 'recebiveis']);
    const varClientes = clientesAnt - clientesAtual;

    const estoqueAtual = getHistSum(filtYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
    const estoqueAnt = getHistSum(filtYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['estoque', 'estoques', 'mercadorias']);
    const varEstoque = estoqueAnt - estoqueAtual;

    const fornecedoresAtual = getHistSum(filtYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
    const fornecedoresAnt = getHistSum(filtYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['fornecedor', 'fornecedores', 'contas a pagar']);
    const varFornecedores = fornecedoresAtual - fornecedoresAnt;

    if (isOfficialDfcAvailable) {
      const yearDfcEntries = allHistData.filter((d: any) => 
        Number(d.year) === filtYear && (normStr(d.type || '') === 'dfc' || normStr(d.docType || '') === 'dfc')
      );
      fco = getDfcVal(yearDfcEntries, ['operacional', 'operacionais', 'fco', 'prejuizo', 'lucro', 'resultado', 'receita', 'despesa', 'fornecedor', 'estoque', 'imposto', 'salario']);
      fci = getDfcVal(yearDfcEntries, ['investimento', 'investimentos', 'fci', 'imobilizado', 'intangivel', 'aquisicao', 'venda', 'equipamento']);
      fcf = getDfcVal(yearDfcEntries, ['financiamento', 'financiamentos', 'fcf', 'capital', 'emprestimo', 'dividendo', 'distribuicao', 'socio', 'banco']);
    } else {
      fco = dreLucro + depreciacaoDre + varClientes + varEstoque + varFornecedores;

      const imobAtual = getHistSum(filtYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['imobilizado', 'intangivel', 'investimentos']);
      const imobAnt = getHistSum(filtYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['imobilizado', 'intangivel', 'investimentos']);
      const varImob = imobAnt - imobAtual;
      fci = varImob - depreciacaoDre;

      const dividasAtual = getHistSum(filtYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos']);
      const dividasAnt = getHistSum(filtYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['emprestimo', 'emprestimos', 'financiamento', 'financiamentos', 'debentures', 'bancos']);
      const varDividas = dividasAtual - dividasAnt;

      const capAtual = getHistSum(filtYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
      const capAnt = getHistSum(filtYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito', 'patrimonio liquido']);
      const varCapital = capAtual - capAnt;

      const saldoInicialLucro = getHistValue(filtYear - 1, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['lucros acumulados', 'lucro acumulado', 'prejuizos acumulados', 'lucros ou prejuizos']);
      const saldoFinalLucro = getHistValue(filtYear, ['balanço patrimonial', 'bp', 'balanco patrimonial', 'balanco'], ['lucros acumulados', 'lucro acumulado', 'prejuizos acumulados', 'lucros ou prejuizos']);
      const dividendos = saldoInicialLucro + dreLucro - saldoFinalLucro;

      fcf = varDividas + varCapital - dividendos;
    }

    const receivables = bpSummary?.contasReceber || bpSummary?.clientes || 0;
    const inventory = bpSummary?.estoques || bpSummary?.estoque || 0;
    
    // Helper to get historical values safely in this scope
    const getHistVal = (y: number, docTypes: string[], nameFilters: string[]) => {
      const yearEntries = allHistData.filter((d: any) => 
        Number(d.year) === y && docTypes.some(t => (d.type || d.docType || '').toLowerCase() === t.toLowerCase())
      );
      const normalizedFilters = nameFilters.map(n => n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
      const match = yearEntries.find((d: any) => {
        const c = (d.conta || d.category || d.name || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        return normalizedFilters.some(n => c.includes(n) || n.includes(c));
      });
      return match?.val || match?.valor || match?.value || 0;
    };

    let resolvedEquityFunding = 0;
    let resolvedThirdPartyFunding = 0;
    let resolvedContasRelacionadas: number | null = null;

    if (dfcDataForRuntime && dfcDataForRuntime.length > 0) {
      // 1. Extract from DFC
      fco = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades Operacionais').reduce((acc: number, curr: any) => acc + curr.amount, 0);
      fci = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades de Investimento').reduce((acc: number, curr: any) => acc + curr.amount, 0);
      fcf = dfcDataForRuntime.filter((d: any) => d.category === 'Atividades de Financiamento').reduce((acc: number, curr: any) => acc + curr.amount, 0);

      resolvedEquityFunding = dfcDataForRuntime
        .filter((d: any) => {
          const cat = (d.category || d.conta || d.name || '').toLowerCase();
          const name = (d.name || '').toLowerCase();
          const isFin = d.category === 'Atividades de Financiamento' || d.type === 'DFC' || d.docType === 'DFC';
          return isFin && (
            cat.includes('aporte') || cat.includes('integraliz') || cat.includes('capital') || cat.includes('socio') || cat.includes('sócio') ||
            name.includes('aporte') || name.includes('integraliz') || name.includes('capital') || name.includes('socio') || name.includes('sócio')
          );
        })
        .reduce((acc: number, curr: any) => acc + Math.abs(curr.amount || curr.val || curr.valor || curr.value || 0), 0);

      resolvedThirdPartyFunding = dfcDataForRuntime
        .filter((d: any) => {
          const cat = (d.category || d.conta || d.name || '').toLowerCase();
          const name = (d.name || '').toLowerCase();
          const isFin = d.category === 'Atividades de Financiamento' || d.type === 'DFC' || d.docType === 'DFC';
          return isFin && (
            cat.includes('emprestimo') || cat.includes('financiamento') || cat.includes('debenture') || cat.includes('banco') ||
            name.includes('emprestimo') || name.includes('financiamento') || name.includes('debenture') || name.includes('banco')
          ) && !(
            cat.includes('socio') || cat.includes('sócio') || name.includes('socio') || name.includes('sócio')
          );
        })
        .reduce((acc: number, curr: any) => acc + Math.abs(curr.amount || curr.val || curr.valor || curr.value || 0), 0);

      const relEntries = dfcDataForRuntime.filter((d: any) => {
        const cat = (d.category || d.conta || d.name || '').toLowerCase();
        return cat.includes('socio') || cat.includes('sócio') || cat.includes('mutuo') || cat.includes('mútuo') || cat.includes('partes relacionadas');
      });
      if (relEntries.length > 0) {
        resolvedContasRelacionadas = relEntries.reduce((acc: number, curr: any) => acc + (curr.amount || curr.val || curr.valor || curr.value || 0), 0);
      }
    }

    // 2. Fallbacks from BP / DRE
    if (resolvedEquityFunding === 0) {
      const currentCap = getHistVal(filtYear, ['bp', 'balanço patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito']);
      const prevCap = getHistVal(filtYear - 1, ['bp', 'balanço patrimonial', 'balanco'], ['capital social', 'capital integralizado', 'capital subscrito']);
      const varCap = currentCap - prevCap;
      if (varCap > 0) {
        resolvedEquityFunding = varCap;
      }
    }

    if (resolvedThirdPartyFunding === 0) {
      const currentDebt = getHistVal(filtYear, ['bp', 'balanço patrimonial', 'balanco'], ['emprestimo', 'financiamento', 'debentures']);
      const prevDebt = getHistVal(filtYear - 1, ['bp', 'balanço patrimonial', 'balanco'], ['emprestimo', 'financiamento', 'debentures']);
      const varDebt = currentDebt - prevDebt;
      if (varDebt > 0) {
        resolvedThirdPartyFunding = varDebt;
      }
    }

    if (resolvedContasRelacionadas === null) {
      const currentRel = getHistVal(filtYear, ['bp', 'balanço patrimonial', 'balanco'], ['mutuo', 'socio', 'sócio', 'partes relacionadas']);
      if (currentRel !== 0) {
        resolvedContasRelacionadas = currentRel;
      }
    }

    const netRevenue = metricsPayload?.financialMetrics?.recLiquida || 0;

    const cashSustainabilityReport = FiduciaryCashIntelligenceRuntime.evaluate(
      dfcDataForRuntime,
      dreLucro,
      dreEbitda,
      rawData.rawFinancialData?.prevCaixa || 0,
      bpSummary?.caixaEquivalentes || 0,
      fco,
      fci,
      fcf,
      0 || 0, // workingCapitalVariation
      receivables,
      inventory,
      bpSummary?.caixaEquivalentes || 0, // availableCash
      resolvedThirdPartyFunding,
      resolvedEquityFunding,
      rawData.historicalCyclesCount || 1,
      12, // monthsCount
      bpSummary?.fornecedores || 0,
      bpSummary?.passivoCirculante || 0,
      resolvedContasRelacionadas,
      bpSummary?.patrimonioLiquido || 0,
      undefined,
      undefined,
      netRevenue
    );

    // Call LongitudinalCashIntelligenceEngine to get trajectoryClassification
    const historicalCashReports = rawData.historicalCashSustainabilityReports || [];
    const allCashReports = [...historicalCashReports, cashSustainabilityReport];
    let longitudinalCashIntelligence = undefined;
    if (allCashReports.length >= 3) {
      const { longitudinalOut } = LongitudinalCashIntelligenceEngine.evaluate(allCashReports);
      longitudinalCashIntelligence = longitudinalOut;
      // also attach to cashSustainabilityReport to satisfy ExecutiveSnapshotEngine if it looks there
      cashSustainabilityReport.longitudinalOut = longitudinalOut;
      cashSustainabilityReport.longitudinalScore = longitudinalOut.longitudinalScore;
    }

    const causalIntelligenceReport = InstitutionalCausalIntelligenceRuntime.evaluate(
      cashSustainabilityReport,
      dreLucro,
      dreEbitda,
      fco,
      0 || 0,
      receivables,
      inventory,
      bpSummary?.caixaEquivalentes || 0,
      0 || 0,
      allHistData,
      rawData.historicalCycles || [],
      filtYear
    );

    const allocations = rawData.allocations || rawData.treasuryAllocations || [
      { id: 'payroll', category: 'Folha de Pagamento', amount: (bpSummary?.caixaEquivalentes || 0) * 0.1, priority: 1, strategicNecessityScore: 95 },
      { id: 'operational_capex', category: 'CAPEX Operacional Mínimo', amount: (bpSummary?.caixaEquivalentes || 0) * 0.05, priority: 2, strategicNecessityScore: 85 },
      { id: 'regulatory_compliance', category: 'Obrigações Regulatórias', amount: (bpSummary?.caixaEquivalentes || 0) * 0.02, priority: 3, strategicNecessityScore: 90 },
      { id: 'critical_suppliers', category: 'Fornecedores Críticos', amount: (bpSummary?.caixaEquivalentes || 0) * 0.08, priority: 4, strategicNecessityScore: 80 },
      { id: 'debt_service', category: 'Serviço da Dívida', amount: (bpSummary?.caixaEquivalentes || 0) * 0.04, priority: 5, strategicNecessityScore: 75 },
      { id: 'discretionary_capex', category: 'CAPEX Discricionário', amount: (bpSummary?.caixaEquivalentes || 0) * 0.03, priority: 6, strategicNecessityScore: 50 },
      { id: 'non_essential', category: 'Despesas Não Essenciais', amount: (bpSummary?.caixaEquivalentes || 0) * 0.01, priority: 7, strategicNecessityScore: 30 },
      { id: 'growth_expansion', category: 'Crescimento e Expansão', amount: (bpSummary?.caixaEquivalentes || 0) * 0.15, priority: 8, strategicNecessityScore: 60 },
      { id: 'distribution', category: 'Distribuição de Dividendos', amount: (bpSummary?.caixaEquivalentes || 0) * 0.05, priority: 9, strategicNecessityScore: 40 }
    ];

    const payables = bpSummary?.fornecedores || bpSummary?.contasAPagar || 0;
    const shortTermDebt = bpSummary?.emprestimosCP || bpSummary?.financiamentosCP || bpSummary?.passivoCirculanteEmprestimos || 0;

    const treasuryIntelligenceReport = TreasuryIntelligenceRuntime.evaluate({
      allocations,
      netIncome: dreLucro,
      retainedEarnings: bpSummary?.lucrosAcumulados || bpSummary?.lucroAcumulado || bpSummary?.prejuizosAcumulados || bpSummary?.lucrosOuPrejuizos || 0,
      fco,
      fci,
      fcf,
      availableCash: bpSummary?.caixaEquivalentes || 0,
      prevCaixa: rawData.rawFinancialData?.prevCaixa || 0,
      startingEquity: rawData.rawFinancialData?.prevPl || bpSummary?.patrimonioLiquido || 0,
      endingEquity: bpSummary?.patrimonioLiquido || 0,
      ebitda: dreEbitda,
      thirdPartyFunding: 0 || 0,
      equityFunding: 0 || 0,
      receivables,
      inventory,
      payables,
      shortTermDebt,
      historicalCyclesCount: rawData.historicalCyclesCount || 1,
      liquidityClassification: cashSustainabilityReport.liquidityClassification?.classification || 'STABLE',
      runwayStability: cashSustainabilityReport.continuityRisk?.runwayStability || 'STABLE',
      hasRuptureRisk: cashSustainabilityReport.continuityRisk?.hasRuptureRisk || false,
      isArtificial: cashSustainabilityReport.artificialLiquidityDetected?.isArtificial || false,
      hasPredictiveDeterioration: cashSustainabilityReport.continuityRisk?.continuityRisk === 'CRITICAL' || cashSustainabilityReport.continuityRisk?.hasRuptureRisk || false,
      normalizedMonthlyCashBurn: fco < 0 ? Math.abs(fco) / 12 : 0
    });

    // Process DLPA (Trilha 2)
    const totalDistributed = rawData.dlpaData ? rawData.dlpaData.reduce((acc: number, cur: any) => acc + (cur.distributedDividends || 0), 0) : 0;
    
    // Construct the official FinancialRuntimeContext
    const contextAdapter = new FinancialRuntimeContextAdapter();
    const businessProfile: InstitutionalBusinessProfile = {
      segmentoOperacional: rawData.rawFinancialData?.segmentoEmpresa || 'Default',
      modeloOperacional: rawData.rawFinancialData?.modeloOperacional,
      intensidadeCapital: rawData.rawFinancialData?.intensidadeCapital,
    };

    const foundationYear = rawData.rawFinancialData?.foundationYear !== undefined 
      ? Number(rawData.rawFinancialData.foundationYear) 
      : (rawData.foundationYear !== undefined ? Number(rawData.foundationYear) : undefined);
    
    const analysisYear = Number(rawData.rawFinancialData?.filterYear || rawData.filterYear || rawData.year || new Date().getFullYear());
    const historicalCycles = rawData.historicalCyclesCount || anosHistorico || 1;
    
    // Extract capital social
    const bpCapitalSocial = bpSummary?.capitalSocial || bpSummary?.capitalIntegralizado || 0;
    const dlpaCapSocialEntry = (rawData.dlpaData || []).find((e: any) => {
      const n = (e.conta || e.category || '').toLowerCase();
      return n.includes('capital social') || n.includes('capital integralizado');
    });
    const capitalSocial = bpCapitalSocial > 0
      ? bpCapitalSocial
      : (dlpaCapSocialEntry
        ? Math.abs(Number(dlpaCapSocialEntry.val ?? dlpaCapSocialEntry.valor ?? dlpaCapSocialEntry.value ?? 0))
        : (bpSummary?.patrimonioLiquido || 0));

    const revenue = metricsPayload?.financialMetrics?.recLiquida || 0;
    const netIncomeVal = dreLucro !== undefined ? dreLucro : 0;

    const financialRuntimeContext = contextAdapter.createContext(businessProfile, {
      foundationYear,
      analysisYear,
      historicalCycles,
      capitalSocial,
      revenue,
      netIncome: netIncomeVal
    });


    const rawCapitalGov = CapitalGovernanceAdapter.process(
      rawData.dlpaData || [],
      dreLucro,
      bpSummary?.patrimonioLiquido || 0,
      0 || totalDistributed,
      bpSummary?.patrimonioLiquido || 0, // startingEquity
      bpSummary?.patrimonioLiquido || 0, // endingEquity
      0 || 0,
      financialRuntimeContext,
      rawData.historicalCycles || rawData.runtimeHistory || []
    );
    const capitalGovernanceReport: ConsolidatedCapitalGovernanceReport = {
      isAvailable: rawCapitalGov.diagnostics.isAvailable,
      overallNarrative: rawCapitalGov.narrative,
      retention: rawCapitalGov.diagnostics.retention,
      distribution: rawCapitalGov.diagnostics.distribution,
      preservation: rawCapitalGov.diagnostics.preservation,
      capitalization: rawCapitalGov.diagnostics.capitalization,
      behavior: rawCapitalGov.diagnostics.behavior,
      fiduciaryOutput: (rawCapitalGov.diagnostics as unknown as { fiduciaryOutput: import('./governance/dlpa/DLPAFiduciaryInterpretationEngine').DLPAFiduciaryOutput }).fiduciaryOutput,
      executiveLayer: rawCapitalGov.executiveLayer,
      semantic: rawCapitalGov.semantic ? {
        cpiStatus: rawCapitalGov.semantic.rawCapitalStatus || 'NEUTRO',
        resolvedGovernanceStatus: rawCapitalGov.semantic.resolvedGovernanceStatus,
        resolvedCapitalStatus: rawCapitalGov.semantic.resolvedCapitalStatus,
        semanticContext: rawCapitalGov.semantic.semanticContext
      } : undefined
    };

    // Process Thesis (Trilha 3)
    const financialThesis = InstitutionalFinancialThesisEngine.generate(
      bpSummary,
      dreEbitda,
      dreLucro,
      cashFlowReport,
      capitalGovernanceReport,
      metrics
    );

    // Process Cross-Statement Causality (Trilha 4)
    const crossStatementCausality = CrossStatementCausalityEngine.analyze(
      bpSummary,
      dreEbitda,
      dreLucro,
      cashFlowReport,
      capitalGovernanceReport
    );

    // Consolidate priorities (Trilha 7)
    const consolidatedActions = ExecutivePriorityConsolidationEngine.consolidate(
      advisory.actionMatrix,
      [],
      cashFlowReport,
      capitalGovernanceReport,
      metrics
    );
    advisory.actionMatrix = consolidatedActions.map(sanitizeNarrative);
    if (consolidatedActions.length > 0) {
      advisory.priorityFocus = sanitizeNarrative(consolidatedActions[0]);
    }

    // Apply the priority cascade resolver based on causality
    const resolvedAdvisory = ExecutivePriorityCascadeResolver.resolve(advisory, causalityProfile);
    advisory.actionMatrix = resolvedAdvisory.actionMatrix;
    advisory.priorityFocus = resolvedAdvisory.priorityFocus;

    // 7. Consolidação e Auditoria (Confidence Integrity Layer)
    traceEngine.Lineage.endNode('ExecutiveReportGenerated');
    traceEngine.Profiler.endEngine('ExecutiveIntelligenceRuntime');

    const fiduciaryEnforcement = GlobalFiduciaryDistributionEnforcementEngine.evaluate(capitalGovernanceReport.fiduciaryOutput);

    if (fiduciaryEnforcement.enforcementTriggered) {
      if (fiduciaryEnforcement.fiduciarySeverityLevel === 'CRITICAL') {
        severity.level = 'CRÍTICO';
      } else if (fiduciaryEnforcement.fiduciarySeverityLevel === 'HIGH') {
        severity.level = 'ESTRESSADO';
      } else if (fiduciaryEnforcement.fiduciarySeverityLevel === 'MODERATE' && severity.level === 'SAUDÁVEL') {
        severity.level = 'SENSÍVEL';
      }

      // Downgrade scores fiduciariamente
      scores.governance = Math.min(scores.governance, 40);
      scores.composite = Math.min(scores.composite, 50);

      // Sanitize narratives
      advisory.executiveSummary = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(advisory.executiveSummary, true);
      advisory.priorityFocus = GlobalFiduciaryDistributionEnforcementEngine.sanitizeNarrative(advisory.priorityFocus, true);
    }

    // Treasury Intelligence Escalation & Propagation
    if (treasuryIntelligenceReport && treasuryIntelligenceReport.isAvailable) {
      const severityMap: Record<string, 'SAUDÁVEL' | 'SENSÍVEL' | 'PRESSIONADO' | 'RESTRITIVO' | 'ESTRESSADO' | 'CRÍTICO' | 'COLAPSO'> = {
        'STABLE': 'SAUDÁVEL',
        'SENSITIVE': 'SENSÍVEL',
        'STRESSED': 'PRESSIONADO',
        'UNSUSTAINABLE': 'RESTRITIVO',
        'CRITICAL': 'CRÍTICO',
        'TREASURY_RUPTURE_RISK': 'COLAPSO'
      };
      
      const mappedSev = severityMap[treasuryIntelligenceReport.severity];
      const severityOrder: Record<string, number> = {
        'SAUDÁVEL': 1,
        'SENSÍVEL': 2,
        'PRESSIONADO': 3,
        'RESTRITIVO': 4,
        'ESTRESSADO': 5,
        'CRÍTICO': 6,
        'COLAPSO': 7
      };
      
      if (mappedSev && severityOrder[mappedSev] > severityOrder[severity.level]) {
        severity.level = mappedSev;
        severity.justification = `Escalado fiduciariamente para ${mappedSev} devido a riscos críticos de governança de tesouraria: ${treasuryIntelligenceReport.governanceVerdict}`;
      }

      // Propagate disclosures to compliance auditFlags or narrative restrictions or advisory actionMatrix
      if (treasuryIntelligenceReport.disclosures && treasuryIntelligenceReport.disclosures.length > 0) {
        const uniqueDisclosures = treasuryIntelligenceReport.disclosures.map(d => sanitizeNarrative(d.message));
        uniqueDisclosures.forEach(disc => {
          if (!advisory.actionMatrix.includes(disc)) {
            advisory.actionMatrix.unshift(disc); // push disclosures to the top of action matrix
          }
        });
      }
      
      // If treasury severity is CRITICAL or TREASURY_RUPTURE_RISK, degrade scores fiduciariamente
      if (treasuryIntelligenceReport.severity === 'CRITICAL') {
        scores.governance = Math.min(scores.governance, 30);
        scores.composite = Math.min(scores.composite, 40);
        scores.financial = Math.min(scores.financial, 35);
      }

      if (treasuryIntelligenceReport.severity !== 'STABLE') {
        advisory.executiveSummary = `${sanitizeNarrative(treasuryIntelligenceReport.governanceVerdict)} ${advisory.executiveSummary}`;
      }
    }

    // Process Patrimonial Intelligence
    const simpleBPSummary = {
      ativoTotal: bpSummary?.ativoTotal || 0,
      ativoCirculante: bpSummary?.ativoCirculante || 0,
      passivoTotal: bpSummary?.passivoTotal || 0,
      passivoCirculante: bpSummary?.passivoCirculante || 0,
      patrimonioLiquido: bpSummary?.patrimonioLiquido || 0,
      estoques: bpSummary?.estoques || bpSummary?.inventario || inventory || 0,
      caixaEquivalentes: bpSummary?.caixaEquivalentes || 0,
      clientes: bpSummary?.clientes || receivables || 0,
      isBalanced: bpSummary?.isBalanced !== false
    };

    const patrimonialRuntime = new PatrimonialIntelligenceRuntime();
    const patrimonialIntelligenceReport = patrimonialRuntime.evaluatePatrimonialStructure(
      financialRuntimeContext,
      simpleBPSummary
    );

    // Process Institutional Operating Pressure (RC-1.8A)
    const pressureInput = PressureAdapter.adapt(
      rawData,
      bpSummary,
      dreLucro,
      dreEbitda,
      fco,
      receivables,
      inventory,
      cashSustainabilityReport,
      treasuryIntelligenceReport,
      patrimonialIntelligenceReport
    );
    const operatingPressureReport = InstitutionalPressureRuntime.evaluate(pressureInput);

    // Process Institutional Recovery Authorization (IRRE) - Provisional Pass
    console.log('RECOVERY ENGINE CALL 1 DEBUG:', {
      cashReportExists: !!cashSustainabilityReport,
      cashLineage: cashSustainabilityReport?.lineageHash,
      cashHash: cashSustainabilityReport?.lineageHash,
    });
    
    let recoveryReport = InstitutionalRecoveryEngine.evaluate({
      fiduciaryOutput: capitalGovernanceReport.fiduciaryOutput,
      treasuryRuntime: treasuryIntelligenceReport,
      cashIntelligenceRuntime: cashSustainabilityReport,
      patrimonialIntelligenceRuntime: patrimonialIntelligenceReport,
      historicalCycles: rawData.historicalCycles || [],
      availableCash: bpSummary?.caixaEquivalentes || 0,
      fco,
      netIncome: dreLucro,
      memoryProfile
    });

    // RRG: Evaluate Provisional Recovery Regression
    let regressionReport = RecoveryRegressionGuardEngine.evaluate({
      recoveryReport,
      fiduciaryOutput: capitalGovernanceReport.fiduciaryOutput,
      treasuryRuntime: treasuryIntelligenceReport,
      cashIntelligenceRuntime: cashSustainabilityReport,
      patrimonialIntelligenceRuntime: patrimonialIntelligenceReport,
      historicalCycles: rawData.historicalCycles || [],
      fco,
      availableCash: bpSummary?.caixaEquivalentes || 0,
      netIncome: dreLucro,
      memoryProfile
    });

    // Process Institutional Resilience (IRAE)
    const resilienceReport = InstitutionalResilienceEngine.evaluate({
      recoveryReport,
      regressionReport,
      fiduciaryOutput: capitalGovernanceReport.fiduciaryOutput,
      treasuryRuntime: treasuryIntelligenceReport,
      cashIntelligenceRuntime: cashSustainabilityReport,
      patrimonialIntelligenceRuntime: patrimonialIntelligenceReport,
      longitudinalRuntimeHistory: rawData.historicalCycles || [],
      historicalCycles: rawData.historicalCycles || [],
      fco,
      availableCash: bpSummary?.caixaEquivalentes || 0,
      netIncome: dreLucro
    });

    // RRG: Re-evaluate Final RRG with Resilience adjustments
    regressionReport = RecoveryRegressionGuardEngine.evaluate({
      recoveryReport,
      fiduciaryOutput: capitalGovernanceReport.fiduciaryOutput,
      treasuryRuntime: treasuryIntelligenceReport,
      cashIntelligenceRuntime: cashSustainabilityReport,
      patrimonialIntelligenceRuntime: patrimonialIntelligenceReport,
      historicalCycles: rawData.historicalCycles || [],
      fco,
      availableCash: bpSummary?.caixaEquivalentes || 0,
      netIncome: dreLucro,
      memoryProfile,
      resilienceReport // Injected
    });

    // IRRE: Re-evaluate Final IRRE with regression and resilience overrides
    recoveryReport = InstitutionalRecoveryEngine.evaluate({
      fiduciaryOutput: capitalGovernanceReport.fiduciaryOutput,
      treasuryRuntime: treasuryIntelligenceReport,
      cashIntelligenceRuntime: cashSustainabilityReport,
      patrimonialIntelligenceRuntime: patrimonialIntelligenceReport,
      historicalCycles: rawData.historicalCycles || [],
      availableCash: bpSummary?.caixaEquivalentes || 0,
      fco,
      netIncome: dreLucro,
      memoryProfile,
      regressionReport, // Injected
      resilienceReport // Injected
    });

    // (Removed old conditional RRG logic since we always do final IRRE pass)

    // Attach reports for downstream consumers
    ((recoveryReport as unknown) as { regressionReport?: unknown }).regressionReport = regressionReport;
    ((recoveryReport as unknown) as { resilienceReport?: unknown }).resilienceReport = resilienceReport;

    // Process Survival priority hierarchy (ISHE)
    console.log('EXECUTIVE DEBUG CASH REPORT:', {
      cashReportExists: !!cashSustainabilityReport,
      keys: cashSustainabilityReport ? Object.keys(cashSustainabilityReport) : [],
      lineageHash: cashSustainabilityReport?.lineageHash,
    });

    const survivalReport = InstitutionalSurvivalHierarchyEngine.evaluate({
      fiduciaryOutput: capitalGovernanceReport.fiduciaryOutput,
      treasuryRuntime: treasuryIntelligenceReport,
      cashIntelligenceRuntime: cashSustainabilityReport,
      patrimonialIntelligenceRuntime: patrimonialIntelligenceReport,
      recoveryReport,
      historicalCycles: rawData.historicalCycles || [],
      historicalCyclesCount: rawData.historicalCyclesCount || 1,
      availableCash: bpSummary?.caixaEquivalentes || 0,
      fco,
      netIncome: dreLucro,
      memoryProfile,
      regressionReport,
      resilienceReport
    });

    if (survivalReport.activeSurvivalMode === 'SURVIVAL_MODE') {
      severity.level = 'CRÍTICO';
      severity.justification = `Bloqueio Normativo de Sobrevivência (ISHE): Modo de sobrevivência ativo devido a ameaça crítica de continuidade operacional e de caixa.`;
      scores.financial = Math.min(scores.financial, 30);
      scores.operational = Math.min(scores.operational, 40);
      scores.governance = Math.min(scores.governance, 30);
      scores.structural = Math.min(scores.structural, 40);
      scores.composite = Math.min(scores.composite, 35);

      if (treasuryIntelligenceReport && treasuryIntelligenceReport.isAvailable) {
        treasuryIntelligenceReport.severity = 'CRITICAL';
        
        // Re-evaluate treasury priorities with isSurvivalMode = true
        const reevaluatedMatrix = TreasuryPriorityMatrixEngine.evaluate({
          isSurvivabilityDegraded: true,
          isRunwayCritical: true,
          isFalseStability: true,
          hasPredictiveRupture: true,
          allocations,
          isSurvivalMode: true,
          treasuryRegressionStatus: regressionReport?.treasuryRegressionStatus
        });
        
        treasuryIntelligenceReport.priorityMatrix = reevaluatedMatrix;
        
        if (!treasuryIntelligenceReport.disclosures.some(d => d.disclosureId === 'DISCLOSURE_SURVIVAL_ACTIVE')) {
          treasuryIntelligenceReport.disclosures.push(
            { 
              disclosureId: 'DISCLOSURE_SURVIVAL_ACTIVE', 
              disclosureType: 'RESTRICTION',
              message: 'Modo de sobrevivência institucional ativo (ISHE). Todas as prioridades financeiras acima do Nível 1 estão congeladas.', 
              severity: 'CRITICAL',
              sourceRuntime: 'TreasuryIntelligenceRuntime',
              restrictionLevel: 'HARD'
            }
          );
        }
      }

      if (capitalGovernanceReport && capitalGovernanceReport.fiduciaryOutput) {
        (capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.patrimonialIntegrityStatus = 'SEVERELY_ERODED';
        (capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.capitalProtectionStatus = 'WEAK_CAPITAL_PROTECTION';
        (capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.distributionEligibility = {
          eligible: false,
          reason: 'Bloqueio de Sobrevivência Institucional (ISHE)',
          failedCriteria: []
        };
        (capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.retentionClassification = 'FORCED_RETENTION';
        (capitalGovernanceReport as unknown as { fiduciaryOutput: Record<string, unknown> }).fiduciaryOutput.institutionalStage = 'SURVIVAL_STAGE_CAPITAL_STRUCTURE';
      }

      advisory.executiveSummary = SurvivalConstraintPropagationEngine.sanitizeNarrative(advisory.executiveSummary, true);
      advisory.priorityFocus = SurvivalConstraintPropagationEngine.sanitizeNarrative(advisory.priorityFocus, true);
    } else if (recoveryReport && recoveryReport.activeRecoveryStage && recoveryReport.activeRecoveryStage !== 'FULL_REAUTHORIZATION') {
      if (treasuryIntelligenceReport && treasuryIntelligenceReport.isAvailable) {
        const reevaluatedMatrix = TreasuryPriorityMatrixEngine.evaluate({
          isSurvivabilityDegraded: false, // Used default false since it's not in survival
          isRunwayCritical: false,
          isFalseStability: false,
          hasPredictiveRupture: false,
          allocations,
          isSurvivalMode: false,
          activeRecoveryStage: recoveryReport.activeRecoveryStage,
          treasuryRegressionStatus: regressionReport?.treasuryRegressionStatus
        });
        treasuryIntelligenceReport.priorityMatrix = reevaluatedMatrix;
        
        if (!treasuryIntelligenceReport.disclosures.some(d => d.disclosureId === 'DISCLOSURE_RECOVERY_ACTIVE')) {
          treasuryIntelligenceReport.disclosures.push(
            { 
              disclosureId: 'DISCLOSURE_RECOVERY_ACTIVE', 
              disclosureType: 'RESTRICTION',
              message: `Restrições progressivas de tesouraria devido a estágio de recuperação (${recoveryReport.activeRecoveryStage}).`, 
              severity: 'HIGH',
              sourceRuntime: 'TreasuryIntelligenceRuntime',
              restrictionLevel: 'SOFT'
            }
          );
        }
      }
    }

    const enrichedActionMatrix = ExecutiveActionMatrixEngine.buildMatrix(
      advisory.actionMatrix,
      metrics,
      bpSummary,
      causality,
      severity.level,
      institutionalContext.operationalSegment.code as SegmentCode,
      capitalGovernanceReport.fiduciaryOutput,
      survivalReport,
      recoveryReport
    );

    // Call the newly implemented Orchestrator
    const institutionalView = InstitutionalFinancialDomainOrchestrator.orchestrate({
      ctx: institutionalContext,
      presence: {
        hasBP: (rawData.bpData && rawData.bpData.length > 0) || Object.keys(rawData.rawFinancialData?.bpSummary || {}).length > 0,
        hasDRE: (rawData.dreData && rawData.dreData.length > 0) || (rawData.rawFinancialData?.recLiquida > 0),
        hasDFC: !!(dfcDataForRuntime && dfcDataForRuntime.length > 0),
        historicalCycles: anosHistorico
      },
      signals: {
        dreRevenueGrowth: (metricsPayload.scaleEfficiency.recGrowth || 0) > 0,
        dreMarginExpansion: (metricsPayload.scaleEfficiency.ebitdaGrowth || 0) > (metricsPayload.scaleEfficiency.recGrowth || 0),
        dfcCashBurn: (cashFlowReport.isAvailable && cashFlowReport.operational.fco < 0),
        dfcOperationalCashFlowNegative: (cashFlowReport.isAvailable && cashFlowReport.operational.fco < 0),
        bpWorkingCapitalPressure: (capitalGovernanceReport.isAvailable && Array.isArray(capitalGovernanceReport.behavior) && capitalGovernanceReport.behavior.some((b: any) => b.includes('pressão') || b.includes('Working Capital'))),
        bpHighLeverage: (capitalGovernanceReport.isAvailable && Array.isArray(capitalGovernanceReport.behavior) && capitalGovernanceReport.behavior.some((b: any) => b.includes('alavanca')))
      }
    });
    // ── Integração Patrimonial Intelligence Layer v2.0 ──────────────────────
    let executivePatrimonialReport = undefined;
    let ceilingOutput = undefined;
    if (hasBP) {
      const bpIndicators = BalanceSheetFinancialMetricsEngine.calculateIndicators(bpSummary);
      const dreDataArray = rawData.dreData || [];
      bpIndicators.push(...BalanceSheetQualityEngine.analyze(bpSummary));
      bpIndicators.push(...WorkingCapitalIntelligenceEngine.analyze(bpSummary, dreDataArray));
      bpIndicators.push(...PatrimonialPreservationEngine.analyze(bpSummary, dreDataArray));
      
      const lrOutput = LiquidityRealityEngine.evaluate(bpSummary);
      bpIndicators.push(...lrOutput.indicators);
      
      const eqOutput = EquityQualityEngine.evaluate(bpSummary);
      bpIndicators.push(...eqOutput.indicators);
      
      const lossAbsorption = bpIndicators.find((i: any) => i.metricName === 'Loss Absorption Capacity')?.value as number | 'INSUFFICIENT_DATA';
      bpIndicators.push(...CapitalStructureIntelligenceEngine.analyze(bpSummary, lrOutput.liquidezReal, lossAbsorption));

      const scoreBreakdown = PatrimonialScoreExplainabilityEngine.calculateScore(bpIndicators);
      const classification = InstitutionalPatrimonialClassificationEngine.classify(scoreBreakdown.globalScore);
      
      const hasValidatedCashFlowEvidence = cashFlowReport.isAvailable && Math.abs(cashFlowReport.operational?.operatingCashFlow || 0) > 0;

      ceilingOutput = PatrimonialClassificationCeilingEngine.evaluate(
        classification.label,
        bpIndicators,
        {
          hasValidatedCashFlowEvidence: hasValidatedCashFlowEvidence,
          netIncome: dreLucro || 0,
          fco: fco
        }
      );
      
      const liqReal = bpIndicators.find((i: any) => i.metricName === 'Liquidez Real')?.value;
      const compEndiv = bpIndicators.find((i: any) => i.metricName === 'Composição do Endividamento')?.value;
      const equityQuality = bpIndicators.find((i: any) => i.metricName === 'Qualidade do Capital (AIOX)')?.classification;

      const execContext: ExecutiveAnalysisContext = {
        analysisYear: new Date().getFullYear(), generatedAt: new Date().toISOString(), moduleContext: 'BP',
        activeFiduciaryRestrictions: ceilingOutput.classificationCeiling ? [ceilingOutput.classificationCeiling.ruleName] : [],
        fiduciaryClassification: ceilingOutput.finalClassification,
        mathematicalClassification: classification.label,
        globalScore: scoreBreakdown.globalScore || 0,
        primaryIndicators: {
          liquidityScore: scoreBreakdown.liquidityScore || 0,
          solvencyScore: scoreBreakdown.capitalStructureScore || 0
        },
        technicalDrivers: {
          liquidityReal: liqReal,
          debtConcentration: compEndiv,
          equityQuality: equityQuality,
          fco: fco
        },
        contextualAlerts: []
      };

      const interpretations = PatrimonialExecutiveInterpretationEngine.generateInterpretations(
        bpIndicators, 
        scoreBreakdown,
        execContext,
        ceilingOutput.classificationCeiling !== null,
        hasValidatedCashFlowEvidence,
        fco > 0
      );
      
      const bpHistoryArray: { year: number; summary: any }[] = [];
      const historySource = rawData.rawFinancialData?.allHistoryData || [];
      const uniqueYears = [...new Set(historySource.map((h: any) => h.year))] as number[];
      
      uniqueYears.forEach(year => {
        const yearEntries = historySource.filter((d: any) => d.year === year && (d.type === 'Balanço Patrimonial' || d.type === 'BP' || d.tipo === 'BP'));
        if (yearEntries.length > 0) {
          const hierarchy = buildBPHierarchy(yearEntries);
          bpHistoryArray.push({ year, summary: hierarchy.summary });
        }
      });
      if (!bpHistoryArray.some(h => h.year === Number(rawData.rawFinancialData?.filterYear))) {
        bpHistoryArray.push({ year: Number(rawData.rawFinancialData?.filterYear || new Date().getFullYear()), summary: bpSummary });
      }

      const patrimonialTrend = PatrimonialTrendEngine.analyzeTrend(bpHistoryArray);


      const rawAdvisory = BoardPatrimonialAdvisoryEngine.generate(bpIndicators, interpretations, execContext);
      
      const consistencyPatrimonial = BoardConsistencyEngine.validate(interpretations.patrimonialThesis, bpIndicators);
      interpretations.patrimonialThesis = consistencyPatrimonial.scrubbedText;
      
      const consistencyPlan = BoardConsistencyEngine.validate(interpretations.executivePlan, bpIndicators);
      interpretations.executivePlan = consistencyPlan.scrubbedText;
      
      const consistencyAdvisory = BoardConsistencyEngine.validate(rawAdvisory.fullText, bpIndicators);
      rawAdvisory.fullText = consistencyAdvisory.scrubbedText;

      const cSituacao = BoardConsistencyEngine.validate(rawAdvisory.boardAssessment.patrimonialSituation, bpIndicators);
      rawAdvisory.boardAssessment.patrimonialSituation = cSituacao.scrubbedText;

      const cLiquidez = BoardConsistencyEngine.validate(rawAdvisory.boardAssessment.liquidityAssessment, bpIndicators);
      rawAdvisory.boardAssessment.liquidityAssessment = cLiquidez.scrubbedText;

      const cPreservacao = BoardConsistencyEngine.validate(rawAdvisory.boardAssessment.capitalPreservationAssessment, bpIndicators);
      rawAdvisory.boardAssessment.capitalPreservationAssessment = cPreservacao.scrubbedText;

      const cEstrutura = BoardConsistencyEngine.validate(rawAdvisory.boardAssessment.capitalStructureAssessment, bpIndicators);
      rawAdvisory.boardAssessment.capitalStructureAssessment = cEstrutura.scrubbedText;

      const cRec = BoardConsistencyEngine.validate(rawAdvisory.boardAssessment.boardRecommendation, bpIndicators);
      rawAdvisory.boardAssessment.boardRecommendation = cRec.scrubbedText;

      const allAdvisoryAudits = Array.from(new Set([
        ...consistencyAdvisory.auditTrail,
        ...cSituacao.auditTrail,
        ...cLiquidez.auditTrail,
        ...cPreservacao.auditTrail,
        ...cEstrutura.auditTrail,
        ...cRec.auditTrail
      ]));

      const inventoryDependency = InventoryDependencyEngine.evaluate(
        bpSummary?.estoques || bpSummary?.estoque || 0,
        bpSummary?.passivoCirculante || 0,
        sectorProfile.expectedInventoryIntensity === 'High'
      );

      // ── Temporal Integrity Audits ──
      const exerciseYear = rawData.year;
      const summaryYear = bpSummary?.exerciseYear;
      
      const lineageAudit = BalanceSheetSummaryLineageAudit.generateLineage(bpSummary, exerciseYear, rawData);
      const bindingGuard = BalanceSheetExerciseBindingGuard.validate(exerciseYear, summaryYear);
      const contaminationAudit = BalanceSheetHistoricalContaminationAudit.audit(exerciseYear, rawData);
      
      const { text: generatedNarrativeText, narrativeMetadata } = BalanceSheetExecutiveNarrativeEngine.generate(
        bpIndicators, 
        bpSummary, 
        exerciseYear, 
        lineageAudit.datasetHash
      );

      const narrativeAudit = BalanceSheetNarrativeTemporalAudit.audit(generatedNarrativeText, bpSummary, bpIndicators);

      const isTemporallyValid = bindingGuard.isValid && !contaminationAudit.isContaminated && !narrativeAudit.isDriftDetected;
      const temporalViolations: string[] = [];
      if (!bindingGuard.isValid) temporalViolations.push(bindingGuard.violation || 'EXERCISE_BINDING_VIOLATION');
      if (contaminationAudit.isContaminated) temporalViolations.push(...contaminationAudit.violations);
      if (narrativeAudit.isDriftDetected) temporalViolations.push(...narrativeAudit.violations);

      if (!isTemporallyValid) {
        RuntimeExecutionRegistry.log({
          code: 'EXERCISE_BINDING_VIOLATION',
          severity: 'CRITICAL',
          module: 'BALANCE_SHEET',
          selectedYear: exerciseYear,
          summaryYear: summaryYear,
          datasetHash: lineageAudit.datasetHash,
        });
      }

      const blockingState = {
        isBlocked: !isTemporallyValid,
        blockingCode: !isTemporallyValid ? (temporalViolations[0]?.split(':')[0] || 'TEMPORAL_INTEGRITY_VIOLATION') : undefined,
        blockingReason: !isTemporallyValid ? (temporalViolations[0] || 'Narrativa incompatível com os indicadores do exercício selecionado.') : undefined
      };

      const technicalViolations: string[] = [];
      if (!hasBP) technicalViolations.push('NO_BALANCE_SHEET_DATA');
      // bpIndicators returning INSUFFICIENT_DATA (like Debt-to-Equity when there's no debt) 
      // should NOT trigger a full technical block. The UI will just show N/A.
      
      const isTechnicalValid = technicalViolations.length === 0;

      const rawAnalyticalContext = {
        clientContext: {
          clientName: rawData.tenantId || 'Unknown', // Ideally get clientName from context, tenantId as fallback
          segment: sectorProfile.name,
          businessStage: (rawData.companyStage as string) || 'Mature',
          operatingProfile: `${sectorProfile.expectedAssetType} Asset / ${sectorProfile.expectedInventoryIntensity} Inventory`,
          companySize: 'Enterprise',
          assumptions: [sectorProfile.typicalCashFlowDynamics]
        },
        patrimonialIntelligence: BalanceSheetPatrimonialIntelligenceEngine.generate(bpSummary, bpIndicators),
        isAvailable: hasBP,
        missingFields: []
      };
      
      const analyticalContextIntegrity = BalanceSheetAnalyticalContextIntegrityGuard.validate(rawAnalyticalContext);

      executivePatrimonialReport = {
        blockingState,
        exerciseYear: exerciseYear,
        summaryYear: summaryYear || 0,
        temporalIntegrity: {
          isValid: isTemporallyValid,
          violations: temporalViolations
        },
        technicalIntegrity: {
          isValid: isTechnicalValid,
          violations: technicalViolations
        },
        executiveIntegrity: {
          isValid: !blockingState.isBlocked,
          violations: blockingState.isBlocked ? [blockingState.blockingReason || 'Executive Blocked'] : []
        },
        analyticalContextIntegrity,
        analyticalContext: rawAnalyticalContext,
        executiveNarrative: blockingState.isBlocked ? undefined : (generatedNarrativeText || interpretations.patrimonialThesis || rawAdvisory.fullText),
        patrimonialThesis: blockingState.isBlocked ? undefined : interpretations.patrimonialThesis,
        boardNarrative: blockingState.isBlocked ? undefined : rawAdvisory.fullText,
        patrimonialHealth: blockingState.isBlocked ? undefined : interpretations.patrimonialThesis,
        executivePlan: blockingState.isBlocked ? undefined : interpretations.executivePlan,
        dominantRiskFamily: blockingState.isBlocked ? undefined : interpretations.dominantRiskFamily,
        liquidityHealth: undefined,
        workingCapitalHealth: undefined,
        capitalStructureHealth: undefined,
        assetImmobilizationHealth: undefined,
        inventoryDependency,
        patrimonialClassification: ceilingOutput.finalClassification,
        patrimonialTrend: patrimonialTrend,
        scoreBreakdown: scoreBreakdown,
        executiveInterpretation: interpretations,
        boardAdvisory: rawAdvisory,
        consistencyAudit: [...consistencyPatrimonial.auditTrail, ...consistencyPlan.auditTrail, ...allAdvisoryAudits],
        indicators: bpIndicators,
        sourceRuntime: 'BP_RUNTIME' as const,
        confidenceScore: 100, // Default start
        governanceConsistency: undefined as any
      };

      const consistency = PatrimonialGovernanceConsistencyEngine.evaluate({
        bpIndicators,
        scoreBreakdown,
        classification: { label: ceilingOutput.finalClassification, rationale: classification.rationale },
        interpretations,
        patrimonialTrend,
        ceilingApplied: ceilingOutput.classificationCeiling !== null,
        finalClassification: ceilingOutput.finalClassification,
        efosContext: {
          compositeScore: scores.composite,
          institutionalHealth: context.stage
        }
      });

      executivePatrimonialReport.governanceConsistency = consistency;
      executivePatrimonialReport.confidenceScore = consistency.confidenceScore;

      if (consistency.consistencyStatus === 'FAIL_CLOSED') {
        executivePatrimonialReport.confidenceScore = Math.min(executivePatrimonialReport.confidenceScore, 60);
      }
    }

    const initialReport: ExecutiveIntelligenceReport = {
      context,
      scores,
      capitalStructure,
      causality,
      severity,
      advisory: {
        ...advisory,
        actionMatrix: enrichedActionMatrix
      },
      decomposition,
      metrics: metricsPayload,
      compliance: {
        runtimeMode,
        confidenceLevel,
        dataCompleteness,
        causalDepth,
        narrativeRestrictions: [
          ...narrativeRestrictions,
          ...prudencyOutput.narrativeRestrictions,
          ...prudencyOutput.advisoryRestrictions,
          ...prudencyOutput.blockedClaims.map(c => `BLOQUEADO: ${c}`),
          ...institutionalContext.narrativeConstraints.blockedNarrativeClaims.map(c => `NÃO reivindicar: ${c}`),
          ...institutionalContext.narrativeConstraints.allowedNarrativeFrame.map(f => `Diretriz: ${f}`)
        ],
        auditFlags: [],
        fiduciaryEnforcement: {
          complianceStatus: fiduciaryEnforcement?.enforcementTriggered ? 'FAILED' : 'PASSED',
          fiduciaryRestrictions: (fiduciaryEnforcement?.governanceRestrictions || []).map((desc: string) => ({
            restrictionType: (fiduciaryEnforcement?.fiduciarySeverityLevel === 'CRITICAL' || fiduciaryEnforcement?.fiduciarySeverityLevel === 'HIGH') ? 'FAIL_CLOSED' : 'RESTRICTED_ACCESS' as const,
            description: desc,
            affectedRuntimes: ['ALL']
          }))
        }
      },
      temporalCausality,
      fiduciaryEnforcement,
      runtimeMetadata: {
        ...traceEngine.finalizeTrace(),
        historicalCyclesAvailable: rawData.historicalCyclesCount || externalMetadata?.historicalCyclesAvailable || rawData.metadata?.historicalCyclesAvailable || 0,
        lineageHash: externalMetadata?.lineageHash || rawData.metadata?.lineageHash || 'hash-fallback',
        tenantId: externalMetadata?.tenantId || rawData.metadata?.tenantId,
        cycleReference: externalMetadata?.cycleReference || rawData.metadata?.cycleReference
      } as unknown as RuntimeExecutionTrace,
      institutionalContext,
      institutionalMemory: memoryProfile,
      institutionalCausality: causalityProfile,
      prudency: prudencyOutput,
      structuralCapital,
      cashSustainabilityReport,
      longitudinalCashIntelligence,
      causalIntelligenceReport,
      treasuryIntelligenceReport,
      cashFlowReport,
      capitalGovernanceReport,
      survivalReport,
      recoveryReport,
      patrimonialIntelligenceReport: executivePatrimonialReport,
      patrimonialStructuralRestrictions: ceilingOutput,
      operatingPressureReport,
      financialThesis,
      crossStatementCausality,
      institutionalView,
      institutionalEvidence: evidenceReport,
      inferences: {
        'CapitalGovernanceAdapter': {
          metrics: {
            patrimonialRecoveryHorizon: capitalGovernanceReport?.executiveLayer?.patrimonialRecoveryHorizon || { value: null, formatted: 'Não Estimável' }
          }
        } as any,
        'LegacyDFCAdapter': {
          metrics: {
            fiduciary: cashSustainabilityReport
          }
        } as any,
        'BoardRiskMatrixAdapter': {
          metrics: {
            dimensions: {
              earnings: cashSustainabilityReport?.earningsQuality?.score ?? 70,
              treasury: cashSustainabilityReport?.cashQuality?.score ?? 70
            }
          }
        } as any
      },
      featureFlags: rawData.featureFlags || rawData.rawFinancialData?.featureFlags,
      constitutionalDashboard: undefined as any // Placeholder to be populated
    };

    // --- CGD (Constitutional Governance Dashboard) Inject ---
    // Note: ConstitutionalGovernanceDashboardEngine is imported at the top of the file
    initialReport.constitutionalDashboard = ConstitutionalGovernanceDashboardEngine.generate(initialReport);


    if (executivePatrimonialReport?.governanceConsistency?.consistencyStatus === 'FAIL_CLOSED') {
      initialReport.compliance.fiduciaryEnforcement.fiduciaryRestrictions.push({
        scope: 'PATRIMONIAL_INTELLIGENCE',
        reason: 'PATRIMONIAL_GOVERNANCE_FAIL_CLOSED',
        confidenceCap: 60,
        description: 'Inconsistências materiais exigem revisão executiva.',
        restrictionType: 'FAIL_CLOSED',
        affectedRuntimes: ['BP_RUNTIME']
      } as any);
    }

    // TFIF v1.0 (Temporal Fiduciary Integrity Framework) Integration
    initialReport.temporalAudit = tempValidation;
    if (tempValidation && (tempValidation.temporalIntegrity === 'FILTERED_WITH_BLOCKED_YEARS' || tempValidation.temporalIntegrity === 'INVALID')) {
      if (!initialReport.compliance.fiduciaryEnforcement.fiduciaryRestrictions) {
        initialReport.compliance.fiduciaryEnforcement.fiduciaryRestrictions = [];
      }
      initialReport.compliance.fiduciaryEnforcement.complianceStatus = 'FAILED';
      initialReport.compliance.fiduciaryEnforcement.fiduciaryRestrictions.push({
        restrictionType: 'FAIL_CLOSED',
        description: `Contaminação temporal detectada: ${tempValidation.violationCode || 'TEMPORAL_FIDUCIARY_VIOLATION'}`,
        affectedRuntimes: ['ALL'],
        violationCode: 'TEMPORAL_FIDUCIARY_VIOLATION'
      } as any);

      initialReport.compliance.narrativeRestrictions.push(
        'BLOQUEADO: Conclusão fiduciária suspensa por violação constitucional temporal.',
        'As conclusões fiduciárias positivas foram suspensas devido a TEMPORAL_FIDUCIARY_VIOLATION.'
      );

      // Force fail-closed by degrading scores to 0
      initialReport.scores = {
        financial: 0,
        operational: 0,
        governance: 0,
        structural: 0,
        composite: 0
      };

      initialReport.severity.level = 'COLAPSO';
    }

    // Process Narrative Orchestration (Trilha 8)
    const orchestratedNarrative = ExecutiveNarrativeOrchestrator.orchestrate(
      initialReport,
      financialThesis.thesis,
      financialThesis.tensions,
      cashFlowReport.overallNarrative,
      capitalGovernanceReport.overallNarrative
    );
    initialReport.orchestratedNarrative = orchestratedNarrative;
    const contextHashPayload = {
      authority: 'ELSA',
      semanticProtocolVersion: 'ELSA-2.0',
      lifecycleStage: capitalGovernanceReport?.semantic?.semanticContext?.lifecycleStage || 'N/A',
      resolvedLabels: [
        capitalGovernanceReport?.semantic?.resolvedGovernanceStatus || '',
        capitalGovernanceReport?.semantic?.resolvedCapitalStatus || ''
      ],
      foundationYear: capitalGovernanceReport?.semantic?.semanticContext?.foundationYear || null,
      analysisYear: capitalGovernanceReport?.semantic?.semanticContext?.analysisYear || null
    };

    const semanticSource = capitalGovernanceReport?.semantic?.semanticContext?.semanticSource || 'LEGACY';

    const renderedContentForAudit = [
      rawCapitalGov.resolvedGovernanceStatus,
      rawCapitalGov.resolvedCapitalStatus,
      rawCapitalGov.narrative
    ].filter(Boolean).join(' ');

    // The SemanticComplianceReport acts as the payload for the SCCF protocol.
    const semanticCompliance = SemanticComplianceAuditRuntime.evaluate(
      semanticSource,
      renderedContentForAudit,
      contextHashPayload,
      semanticSource === 'ELSA' ? 'EXECUTIVE' : 'TECHNICAL_AUDIT'
    );
    
    initialReport.semanticCompliance = semanticCompliance;

    // Evaluate Constitutional Governance Layer (CGL v1.0)
    const constitutionalContext = {
      semanticSource,
      renderedContent: JSON.stringify(capitalGovernanceReport),
      semanticLineagePayload: contextHashPayload,
      semanticScope: semanticSource === 'ELSA' ? 'EXECUTIVE' : 'TECHNICAL_AUDIT',
      
      fiduciaryConclusion: capitalGovernanceReport?.overallNarrative?.includes('Healthy Liquidity') ? 'HEALTHY_LIQUIDITY' : 'UNKNOWN',
      fiduciaryEvidenceStatus: cashFlowReport?.isAvailable ? (cashFlowReport.operational.fco < 0 ? 'CRITICAL' : 'STABLE') : 'STABLE',
      
      treasuryConclusion: 'UNKNOWN',
      operationalCashFlow: fco,
      
      hasExecutiveConclusion: !!initialReport.orchestratedNarrative,
      causalChainPresent: !!initialReport.causality?.rootCause,
      
      executiveMetricsPresent: !!initialReport.scores?.composite,
      lineageHash: contextHashPayload.analysisYear?.toString() || 'hash',
      
      isAIGenerated: false
    };

    const constitutionalCompliance = ConstitutionalGovernanceRuntime.evaluate(constitutionalContext);
    initialReport.constitutionalCompliance = constitutionalCompliance;

    // Evaluate Constitutional Decision Intelligence Layer (CDIL v1.1)
    const decisionIntelligence = ConstitutionalDecisionRuntime.evaluate(
      constitutionalCompliance.constitutionalIntegrity,
      constitutionalContext
    );
    initialReport.decisionIntelligence = decisionIntelligence;

    // Evaluate Institutional Scenario Engine (ISE v1.1)
    if (decisionIntelligence && !('status' in decisionIntelligence) && decisionIntelligence.constitutionalStatus === 'VALID') {
      const scenarioIntelligence = ScenarioImpactRuntime.evaluate(
        constitutionalContext,
        decisionIntelligence.executiveDecisions
      );
      initialReport.scenarioIntelligence = scenarioIntelligence;
    }

    // Process Experience Consistency Check (Trilha 10)
    const consistencyReport = ExecutiveExperienceConsistencyEngine.validate(initialReport);
    initialReport.consistencyReport = consistencyReport;

    let report = initialReport;

    // Apply Trilha 1: Empty Cycle Fail-Closed
    if (EmptyCycleIntegrityEngine.evaluate(rawData)) {
      report = EmptyCycleIntegrityEngine.applyFailClosed(report);
    } else {
      // Apply Trilha 3: Scale Efficiency Fail-Closed
      if (ScaleEfficiencyIntegrityEngine.evaluate(anosHistorico)) {
        report = ScaleEfficiencyIntegrityEngine.applyFailClosed(report);
      }
      
      // Apply Trilha 6: Historical Series validation
      if (!HistoricalSeriesIntegrityEngine.validate(metricsPayload.chartData)) {
        report = HistoricalSeriesIntegrityEngine.applyFailClosed(report);
      }
    }

    // Apply Trilha 7: Terminology Hardening
    report = ExecutiveDiagnosisComposer.hardenReportStrings(report);

    // Apply Institutional Fiduciary Runtime Constitution Validation (render mode)
    RuntimeComplianceEngine.validate(report, 'render');

    // === EFOS EXECUTIVE COMMAND LAYER ===
    report.executiveCommand = InstitutionalExecutiveCommandRuntime.evaluate(report);

    // === EFOS OPERATIONAL GOVERNANCE LAYER ===
    report.operationalGovernance = InstitutionalOperationalGovernanceRuntime.evaluate(report);

    // === EFOS STRATEGIC INTELLIGENCE LAYER ===
    report.strategicIntelligence = InstitutionalStrategicIntelligenceRuntime.evaluate(report);

    // === EFOS INSTITUTIONAL BOARD PACK & REPORTING LAYER ===
    // This is the compilation phase. It does not generate new data, only solidifies existing runtime data.
    report.institutionalBoardPack = InstitutionalBoardPackRuntime.generate(report);

    // === EFOS DEPLOYMENT READINESS LAYER ===
    // As explicitly defined in doctrine, this is the LAST barrier. It does not alter
    // previous fiduciary calculations. It audits the runtime's safety to be deployed.
    const envConfig = readRuntimeEnvironmentConfig();

    const deploymentReadiness = InstitutionalDeploymentReadinessEngine.evaluate({
      executiveReport: report,
      environmentConfiguration: {
        environmentType: envConfig.environmentType as unknown as DeploymentEnvironment,
        mockFactoriesEnabled: envConfig.mockFactoriesEnabled,
        debugModeEnabled: envConfig.debugModeEnabled,
        tenantIsolationEnabled: true,
        activeSimulations: false,
      },
      tenantIsolationRuntime: {
        tenantId: 'tenant-placeholder',
        isPilotTenant: envConfig.isPilotTenant,
        isProductionTenant: envConfig.isProductionTenant,
        hasCrossTenantAccess: false,
      },
      runtimeHealthMetrics: {
        testsPassed: envConfig.testsPassed,
        typecheckPassed: envConfig.typecheckPassed,
        buildPassed: envConfig.buildPassed,
        unresolvedAnomalies: 0,
      },
      currentUserRole: envConfig.userRole,
      lineageHash: report.runtimeMetadata?.lineageHash || 'placeholder-hash',
      auditTrail: report.runtimeMetadata?.auditTrail || [],
    });

    report.deploymentReadiness = deploymentReadiness;

    // === EFOS INSTITUTIONAL ONBOARDING LAYER ===
    // Governs tenant activation strictly using the validated readiness layer + mock/DB onboarding data.
    const mockOnboardingInput = InstitutionalOnboardingMockFactory.createDefaultInput();
    const onboardingInput = {
      ...mockOnboardingInput,
      deploymentReadinessReport: deploymentReadiness,
      executiveReport: report,
      lineageHash: report.runtimeMetadata?.lineageHash || 'placeholder-hash',
      auditTrail: report.runtimeMetadata?.auditTrail || [],
      environmentConfiguration: {
        ...mockOnboardingInput.environmentConfiguration,
        environmentType: envConfig.environmentType as unknown as DeploymentEnvironment,
      }
    };
    report.institutionalOnboarding = InstitutionalOnboardingOrchestrator.evaluate(onboardingInput);

    // Compile Semantic Lineage Payload (excluding long narratives to avoid false drift)
    const semanticLineagePayload = {
      authority: 'ELSA',
      semanticProtocolVersion: 'ELSA-2.0',
      lifecycleStage: rawCapitalGov.semantic?.lifecycleStage || 'ESTABLISHED_ANALYSIS',
      resolvedLabels: [
        rawCapitalGov.resolvedGovernanceStatus || '',
        rawCapitalGov.resolvedCapitalStatus || ''
      ].filter(Boolean),
      foundationYear: foundationYear || null,
      analysisYear: analysisYear || null
    };

    const renderedContent = renderedContentForAudit;

    // Evaluate Constitutional Governance
    report.constitutionalEvaluation = constRuntime.evaluateRuntimeState({
      availableCash: bpSummary?.caixaEquivalentes || 0,
      leverageRatio: bpSummary?.passivoTotal ? (bpSummary.passivoCirculanteEmprestimos || 0) / bpSummary.passivoTotal : 0,
      projectedRunwayMonths: report.cashSustainabilityReport?.continuityRisk?.projectedRunwayMonths || 12,
      hasBrokenLineage: !report.runtimeMetadata?.lineageHash || report.runtimeMetadata.lineageHash === 'hash-fallback',
      hasTamperedSignature: false,
      compliance: {
        confidenceLevel: report.compliance?.confidenceLevel,
        runtimeMode: report.compliance?.runtimeMode
      },
      resilienceReport: {
        confidenceLevel: report.resilienceReport?.confidenceLevel
      },
      failClosedTriggered: report.runtimeMetadata?.status === 'BLOCKED',
      deploymentReadiness: {
        deploymentBlocked: report.deploymentReadiness?.deploymentBlocked
      },
      survivalReport: {
        activeSurvivalMode: report.survivalReport?.activeSurvivalMode ? 'ACTIVE' : 'INACTIVE',
        blockedActions: fiduciaryEnforcement?.blockedActions || []
      },
      lineageHash: report.runtimeMetadata?.lineageHash || 'placeholder-hash',
      executionId: report.runtimeMetadata?.executionId || 'exec-id',
      semanticSource: rawCapitalGov.semanticSource,
      renderedContent,
      semanticLineagePayload,
      semanticScope: 'EXECUTIVE'
    });

    report.timeline = ExecutiveTimelineEngine.generate(rawData, report);

    // Generate causal explanations (ICE v1.0)
    if (report.timeline) {
      // Collect parsed cycles from the timeline run
      const parsedCycles = report.timeline.lineageHash ? (ExecutiveTimelineEngine as any).generate(rawData, report).timelineEvents : []; // Wait, let's look at how ExecutiveTimelineEngine parses cycles.
      // Wait, let's check how we can parse the cycles. We can parse rawData.historicalCycles and the current report!
      // In ExecutiveTimelineEngine, the generate method expects (rawData, currentReport) and returns the full timeline output.
      // Since ETE already parses cycles and does it internally, can we reconstruct the HistoricalRuntimeCycle[]?
      // Yes! In ExecutiveTimelineEngine.ts, we have:
      // parsedCycles.push(this.parseCycle(item))
      // So we can parse them in the same way, or just invoke a static helper or call generate!
      // Let's call the ETE static parser or let's look at ETE generate.
      // Let's see: we can parse cycles by doing:
      const rawHistory = rawData.historicalCycles || rawData.runtimeHistory || [];
      const parsedCyclesList = [];
      for (const item of rawHistory) {
        try {
          parsedCyclesList.push(ExecutiveTimelineEngine.parseCycle(item));
        } catch (e) {}
      }
      if (report) {
        try {
          parsedCyclesList.push(ExecutiveTimelineEngine.parseCycle(report));
        } catch (e) {}
      }
      // Deduplicate and sort
      const uniqueCyclesMap: { [key: string]: any } = {};
      for (const cycle of parsedCyclesList) {
        if (cycle.cycleReference) {
          uniqueCyclesMap[cycle.cycleReference] = cycle;
        }
      }
      const sortedCycles = Object.values(uniqueCyclesMap).sort((a: any, b: any) => 
        a.cycleReference.localeCompare(b.cycleReference)
      );

      report.fiduciaryCausality = InstitutionalCausalityExplorer.generate(sortedCycles, report.timeline.confidenceLevel);
    }


    // SFFL v1.0: Canonical State Enforcement
    report.isSandbox = !!rawData?.isSandbox || !!rawData?.metadata?.isSandbox;
    report.isDemonstrative = !!rawData?.isDemonstrative || !!rawData?.metadata?.isDemonstrative;
    
    console.log('[DEBUG-CANONICAL] report.scores.composite:', report.scores?.composite);
    console.log('[DEBUG-CANONICAL] patClass:', report.patrimonialIntelligenceReport?.scoreBreakdown?.scoreGlobal);
    let canonicalStatus = 'CRITICAL';
    if (report.scores?.composite >= 70) canonicalStatus = 'HEALTHY';
    else if (report.scores?.composite >= 40) canonicalStatus = 'WARNING';

    // Alignment Guard: Ensure badge reflects patrimonial classification if it is healthy
    const patClass = report.patrimonialIntelligenceReport?.patrimonialClassification;
    if (patClass === 'RESILIENT' || patClass === 'HEALTHY' || patClass === 'STABLE') {
      canonicalStatus = 'HEALTHY';
    } else if (patClass === 'VULNERABLE') {
      canonicalStatus = 'WARNING';
    }

    let canonicalTrend = 'STABLE';
    if (report.scores?.financialStress?.isStressed || report.severity?.level === 'COLAPSO' || report.severity?.level === 'CRÍTICO') {
      canonicalTrend = 'DETERIORATING';
    } else if (report.scores?.composite > 80) {
      canonicalTrend = 'IMPROVING';
    }

    report.fiduciaryWarnings = report.compliance?.fiduciaryEnforcement?.fiduciaryRestrictions?.map(r => r.description) || [];

    report.canonicalState = {
      status: canonicalStatus,
      trend: canonicalTrend,
      severity: report.severity?.level || 'UNKNOWN',
      confidence: report.compliance?.confidenceLevel || 'UNKNOWN',
      posture: report.advisory?.priorityFocus || 'UNKNOWN',
      restrictions: report.compliance?.narrativeRestrictions || [],
      fiduciaryWarnings: report.fiduciaryWarnings
    };

    return report;

  }
}

// Exporta o Singleton oficial para uso na plataforma
export const executiveRuntime = new ExecutiveIntelligenceRuntime();
