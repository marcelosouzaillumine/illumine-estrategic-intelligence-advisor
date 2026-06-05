import { 
  CashIntelligenceRuntimeOutput, 
  CashConfidenceLevel,
  FinancialRuntimeContext,
  AnalysisPeriodType,
  UniversalCashIndicators
} from './CashIntelligenceTypes';
import { CashFlowReconciliationEngine } from './CashFlowReconciliationEngine';
import { ArtificialLiquidityDetector } from './ArtificialLiquidityDetector';
import { LiquidityClassificationEngine } from './LiquidityClassificationEngine';
import { OperationalSustainabilityRuntime } from './OperationalSustainabilityRuntime';
import { InstitutionalContinuityEngine } from './InstitutionalContinuityEngine';
import { FiduciaryCashInterpreter } from './FiduciaryCashInterpreter';
import { UniversalCashIndicatorsEngine } from './UniversalCashIndicatorsEngine';
import { CashConstraintDiagnosisEngine } from './CashConstraintDiagnosisEngine';
import { OperationalCashBurnEngine } from './OperationalCashBurnEngine';
import { ShareholderDependencyEngine } from './ShareholderDependencyEngine';
import { CashSustainabilityEngine } from './CashSustainabilityEngine';
import { RevenueCashConversionEngine } from './RevenueCashConversionEngine';
import { CashBoardDecisionSupportEngine } from './CashBoardDecisionSupportEngine';
import { DFCCashAdvisoryEngine } from './DFCCashAdvisoryEngine';
import { CashReinvestmentEngine } from './CashReinvestmentEngine';

// DEEFF v1.0 Imports
import { DFCExecutiveSnapshotEngine } from './DFCExecutiveSnapshotEngine';
import { CashQualityExplainabilityEngine } from './CashQualityExplainabilityEngine';
import { CashExecutiveAdvisoryEngine } from './CashExecutiveAdvisoryEngine';
import { DFCConsistencyAuditEngine } from './DFCConsistencyAuditEngine';
import { DFCFiduciaryPriorityResolver } from './DFCFiduciaryPriorityResolver';
import { RunwayClassificationEngine } from './RunwayClassificationEngine';

// Roadmap v1.0 Imports
import { CashFlowCausalIntelligenceEngine } from '../cash-causal-intelligence/CashFlowCausalIntelligenceEngine';
import { CashFlowScenarioEngine } from '../cash-scenario-intelligence/CashFlowScenarioEngine';
import { TreasuryEarlyWarningEngine } from '../treasury-early-warning/TreasuryEarlyWarningEngine';
import { TreasurySustainabilityEngine } from '../treasury-sustainability/TreasurySustainabilityEngine';

export class FiduciaryCashIntelligenceRuntime {
  /**
   * Ponto de entrada unificado e soberano do ecossistema de inteligência fiduciária de caixa.
   */
  public static evaluate(
    dfcData: any[],
    dreNetIncome: number,
    dreEbitda: number,
    bpCashEquivalentsStart: number,
    bpCashEquivalentsEnd: number,
    fco: number,
    fci: number,
    fcf: number,
    workingCapitalVariation: number,
    receivables: number,
    inventory: number,
    availableCash: number,
    thirdPartyFunding: number,
    equityFunding: number,
    historicalCyclesCount: number,
    monthsCount: number,
    fornecedores: number,
    passivoCirculante: number,
    contasRelacionadas: number | null,
    patrimonioLiquido: number,
    context?: FinancialRuntimeContext,
    analysisPeriodType?: AnalysisPeriodType,
    netRevenue?: number,
    varClientes?: number,
    varEstoque?: number,
    varFornecedores?: number,
    overhead?: number,
    consecutiveNegativeFCOCycles?: number,
    isInventoryGrowthExceedingRevenue?: boolean,
    isReceivablesGrowthExceedingRevenue?: boolean
  ): CashIntelligenceRuntimeOutput {
    const auditTrail: string[] = ['Execution started at FiduciaryCashIntelligenceRuntime'];
    const fcoOperacionalReal = fco - (contasRelacionadas || 0);

    // 1. Camada de Reconciliação Estrutural
    const reconciliation = CashFlowReconciliationEngine.validate(
      dfcData,
      dreNetIncome,
      bpCashEquivalentsStart,
      bpCashEquivalentsEnd,
      fco,
      fci,
      fcf
    );
    auditTrail.push(`Reconciliation validated with status: ${reconciliation.reconciliationStatus}`);

    const hashInputs = [
      dreNetIncome, dreEbitda, bpCashEquivalentsStart, bpCashEquivalentsEnd,
      fco, fci, fcf, workingCapitalVariation, receivables, inventory,
      availableCash, thirdPartyFunding, equityFunding, historicalCyclesCount,
      monthsCount, fornecedores, passivoCirculante, contasRelacionadas, patrimonioLiquido
    ];
    const lineageHash = this.generateLineageHash(hashInputs);
    auditTrail.push(`Lineage hash generated: ${lineageHash}`);

    // Se a reconciliação estiver completamente bloqueada (Fail-Closed)
    if (!reconciliation.isReconcilable && reconciliation.reconciliationStatus === 'BLOCKED') {
      const blockedReconciliationOutput = {
        ...reconciliation,
        reconciliationStatus: 'CASH_RECONCILIATION_FAIL_CLOSED' as const
      };
      
      const blockedOutput: CashIntelligenceRuntimeOutput = {
        isAvailable: false,
        contextSegment: context,
        universalIndicators: {} as unknown as UniversalCashIndicators, // Not computed
        liquidityClassification: {
          classification: 'CONTINUITY_RISK',
          label: 'Inconciliável contábil',
          confidence: 'BLOCKED',
          severity: 'COLAPSO',
          rationale: 'Análise abortada por divergência crítica e inconciliável entre BP e DFC.'
        },
        artificialLiquidityDetected: {
          isArtificial: false,
          diagnoses: [],
          liquidityDistortionFactors: [],
          rationale: 'Análise de liquidez artificial bloqueada.',
          blockedConclusions: ['HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH', 'HIGH_CONFIDENCE_ANALYSIS']
        },
        reconciliationAlerts: blockedReconciliationOutput,
        legacyOperationalSustainabilityAssessment: {
          isSustained: false,
          selfFinancingCapacity: 'NONE',
          operationalCashConsistency: 'INSUFFICIENT_HISTORY',
          operationalFragilityIndex: 100,
          dependencyTrend: 'CRITICAL',
          resilienceScore: 0,
          longitudinalConsistency: 'Divergência de reconciliação impede análise de consistência.'
        },
        fiduciaryOperationalSustainabilityAssessment: {
          classification: 'STRUCTURAL_CASH_COLLAPSE',
          resilienceScore: 0,
          operationalFragilityIndex: 100,
          longitudinalConsistency: 'Divergência impede análise.'
        },
        continuityRisk: {
          continuityRisk: 'CRITICAL',
          hasRuptureRisk: true,
          projectedRunwayMonths: 0,
          runwayClassification: 'SURVIVAL_MODE',
          runwayConfidence: 'BLOCKED',
          runwayDistortionFactors: [],
          runwayStability: 'COLLAPSING',
          liquidityDependency: true,
          continuityRiskDrivers: ['reconciliation_blocked'],
          recommendedActions: ['Realizar auditoria contábil urgente nos lançamentos de BP e DFC.']
        },
        fiduciaryNarrative: {
          executiveNarrative: 'Processamento bloqueado por quebra de consistência matemática dos dados de fluxo de caixa.',
          fiduciaryOpinion: 'Parecer fiduciário retido por inconsistência material.',
          fiduciaryWarnings: reconciliation.disclosures,
          blockedInterpretations: ['HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH'],
          causalFindings: ['Divergência patrimonial na conciliação BP x DFC.'],
          institutionalImplications: ['Ruptura de conformidade lógica nas demonstrações financeiras.']
        },
        blockedConclusions: ['HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH'],
        allowedConclusions: [],
        confidenceLevel: 'BLOCKED',
        auditTrail: [...auditTrail, 'Execution halted due to critical reconciliation block'],
        lineageHash,
        cashIntelligenceLineageHash: lineageHash,
        causalReferences: [],
        score: 0
      };

      return blockedOutput;
    }

    // 2. Indicadores Universais Obrigatórios
    const capitalizacaoExterna = thirdPartyFunding + equityFunding;
    const universalIndicators = UniversalCashIndicatorsEngine.evaluate(
      fcoOperacionalReal, fcf, dreEbitda, capitalizacaoExterna, fornecedores, passivoCirculante,
      workingCapitalVariation, contasRelacionadas, patrimonioLiquido, monthsCount, availableCash, context
    );
    auditTrail.push('Universal Indicators calculated');

    // 3. Detecção de Liquidez Artificial
    const artificial = ArtificialLiquidityDetector.evaluate(
      fco, fcf, fci, thirdPartyFunding, equityFunding
    );
    auditTrail.push(`Artificial liquidity checked. Detected: ${artificial.isArtificial}`);

    // 4. Sustentabilidade Operacional
    const sustainabilityOutputs = OperationalSustainabilityRuntime.evaluate(
      fco, fcf, dreNetIncome, workingCapitalVariation, historicalCyclesCount
    );
    const legacySust = sustainabilityOutputs.legacy;
    const fidSust = sustainabilityOutputs.fiduciary;
    auditTrail.push(`Operational sustainability evaluated. Resilience score: ${legacySust.resilienceScore}`);

    // 5. Continuidade Institucional (Survival Horizon)
    const continuity = InstitutionalContinuityEngine.evaluate(
      fcoOperacionalReal, fci, fcf, availableCash, dreNetIncome, thirdPartyFunding, equityFunding, historicalCyclesCount,
      'ADJUSTED_OPERATIONAL_BURN'
    );
    // Sobrescrever runtime pelo universal calculation (consistência de cálculo)
    const roundedRunway = Math.round(universalIndicators.cashRunwayInstitucional.months * 10) / 10;
    continuity.projectedRunwayMonths = roundedRunway;
    universalIndicators.cashRunwayInstitucional.months = roundedRunway;
    continuity.runwayClassification = universalIndicators.cashRunwayInstitucional.classification;
    auditTrail.push(`Institutional continuity assessed. Continuity risk: ${continuity.continuityRisk}`);

    // 6. Classificação de Liquidez
    const classification = LiquidityClassificationEngine.evaluate(
      fcoOperacionalReal, fci, fcf, availableCash, reconciliation.confidence,
      continuity.projectedRunwayMonths, legacySust.resilienceScore, continuity.hasRuptureRisk, artificial.isArtificial, context,
      'ADJUSTED_OPERATIONAL_BURN'
    );
    auditTrail.push(`Liquidity classification: ${classification.classification}`);

    // 7. Parecer e Narrativa Fiduciária
    const narrative = FiduciaryCashInterpreter.interpret(
      classification.classification, 
      artificial.isArtificial, 
      reconciliation, 
      legacySust, 
      continuity,
      historicalCyclesCount < 3
    );
    auditTrail.push('Fiduciary narrative interpreted');

    // Compilação de Conclusões Permitidas e Bloqueadas (FAIL-CLOSED)
    let blockedConclusions = [...new Set([...artificial.blockedConclusions, ...narrative.blockedInterpretations])];
    const allowedConclusions: string[] = [];

    // Bloqueios Fiduciários Específicos
    if (fco < 0 && continuity.projectedRunwayMonths < 3) {
      blockedConclusions.push('HEALTHY_LIQUIDITY', 'STRONG_TREASURY', 'SUSTAINABLE_GROWTH', 'REINVESTMENT_CAPACITY');
    }
    if (classification.classification === 'ARTIFICIAL_LIQUIDITY' || classification.classification === 'DEPENDENCIA_DE_CAPITALIZACAO') {
      blockedConclusions.push('HEALTHY_LIQUIDITY', 'STRONG_TREASURY', 'SUSTAINABLE_GROWTH', 'REINVESTMENT_CAPACITY', 'OPERATIONALLY_SUSTAINABLE');
    }
    if (universalIndicators.conversaoEbitdaCaixa.alert === 'SYNTHETIC_PROFIT_ALERT') {
      blockedConclusions.push('STRONG_OPERATIONAL_GENERATION');
    }

    if (fco > 0 && !blockedConclusions.includes('STRONG_OPERATIONAL_GENERATION')) {
      allowedConclusions.push('OPERATIONAL_GENERATION');
    }
    if (
      (classification.classification === 'OPERATIONAL_SUSTAINABLE' || 
       classification.classification === 'TESOURARIA_ESTRUTURALMENTE_SAUDAVEL' || 
       classification.classification === 'REINVESTIMENTO_OPERACIONAL_SAUDAVEL') 
      && !blockedConclusions.includes('HEALTHY_LIQUIDITY')
    ) {
      allowedConclusions.push('HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH');
    }

    // Remover duplicadas
    blockedConclusions = [...new Set(blockedConclusions)];

    // Executive Intelligence Framework
    const confidence = reconciliation.confidence;
    const cashConstraintDiagnosis = CashConstraintDiagnosisEngine.evaluate(fcoOperacionalReal, fci, fcf, receivables, inventory, workingCapitalVariation, contasRelacionadas, confidence, dreNetIncome, dreEbitda);
    const cashBurnAnalysis = OperationalCashBurnEngine.evaluate(fcoOperacionalReal, monthsCount, confidence);
    const shareholderDependencyAnalysis = ShareholderDependencyEngine.evaluate(fcoOperacionalReal, equityFunding, confidence);
    
    const liquidezOperacionalReal = passivoCirculante > 0 ? (fcoOperacionalReal / passivoCirculante) : 1.0; 
    
    const cashSustainabilityAnalysis = CashSustainabilityEngine.evaluate(fcoOperacionalReal, continuity.projectedRunwayMonths, equityFunding, thirdPartyFunding, liquidezOperacionalReal, confidence);
    
    const cashConversionAnalysis = RevenueCashConversionEngine.evaluate(fcoOperacionalReal, netRevenue || 0, confidence);
    
    const cashBoardDecisionFramework = CashBoardDecisionSupportEngine.evaluate(fcoOperacionalReal, cashConstraintDiagnosis, cashBurnAnalysis, shareholderDependencyAnalysis, cashSustainabilityAnalysis, continuity.projectedRunwayMonths, confidence, cashConversionAnalysis);
    const cashExecutiveAdvisory = DFCCashAdvisoryEngine.evaluate(fcoOperacionalReal, cashBoardDecisionFramework, cashSustainabilityAnalysis, confidence);
    const cashReinvestmentAnalysis = CashReinvestmentEngine.evaluate(fcoOperacionalReal, fci, confidence);

    // DEEFF v1.0 Integrations
    const dependencyCritical = classification.classification === 'DEPENDENCIA_DE_CAPITALIZACAO' || classification.classification === 'SUSTENTACAO_EXTERNA';
    const isBurning = fcoOperacionalReal < 0;
    const runwayClass = RunwayClassificationEngine.classify(continuity.projectedRunwayMonths);
    const runwayCritical = runwayClass === 'CRITICO' || runwayClass === 'EMERGENCIAL';
    const primaryConstraint = cashConstraintDiagnosis.primaryConstraint;

    const dfcExecutiveSnapshot = DFCExecutiveSnapshotEngine.buildSnapshot(
      fcoOperacionalReal,
      continuity.projectedRunwayMonths,
      dependencyCritical,
      primaryConstraint
    );

    const dfcPriorities = DFCFiduciaryPriorityResolver.resolve({
      fco: fcoOperacionalReal,
      runwayMonths: continuity.projectedRunwayMonths,
      cqs: legacySust.resilienceScore, 
      dependencyClassification: dependencyCritical ? 'CRITICAL' : 'MODERATE'
    });

    const compressedAdvisory = CashExecutiveAdvisoryEngine.compress(
      isBurning,
      dependencyCritical,
      primaryConstraint,
      runwayCritical
    );

    const consistencyAudit = DFCConsistencyAuditEngine.audit(
      dfcPriorities,
      runwayClass,
      legacySust.resilienceScore, 
      compressedAdvisory.restricaoPrincipal,
      fcoOperacionalReal
    );

    // Roadmap v1.0 Integrations
    const causalIntelligence = CashFlowCausalIntelligenceEngine.evaluate(
      fco,
      dreNetIncome,
      varClientes || 0,
      varEstoque || 0,
      varFornecedores || 0,
      'OFFICIAL_FCO'
    );

    const scenarioIntelligence = CashFlowScenarioEngine.evaluate(
      fcoOperacionalReal,
      availableCash,
      receivables,
      inventory,
      overhead || 0,
      netRevenue || 0,
      equityFunding,
      monthsCount || 12
    );

    const fundingRatio = fcoOperacionalReal < 0 ? (equityFunding / Math.abs(fcoOperacionalReal)) : 0;
    const earlyWarningSystem = TreasuryEarlyWarningEngine.evaluate(
      fcoOperacionalReal,
      continuity.projectedRunwayMonths,
      consecutiveNegativeFCOCycles || 0,
      fundingRatio,
      isInventoryGrowthExceedingRevenue || false,
      isReceivablesGrowthExceedingRevenue || false
    );

    const treasurySustainability = TreasurySustainabilityEngine.evaluate(
      fcoOperacionalReal,
      fci,
      continuity.projectedRunwayMonths,
      fundingRatio
    );

    const output: CashIntelligenceRuntimeOutput = {
      isAvailable: true,
      contextSegment: context,
      universalIndicators,
      liquidityClassification: classification,
      artificialLiquidityDetected: artificial,
      reconciliationAlerts: reconciliation,
      legacyOperationalSustainabilityAssessment: legacySust,
      fiduciaryOperationalSustainabilityAssessment: fidSust,
      continuityRisk: continuity,
      fiduciaryNarrative: narrative,
      
      cashConstraintDiagnosis,
      cashBurnAnalysis,
      shareholderDependencyAnalysis,
      cashSustainabilityAnalysis,
      cashConversionAnalysis,
      cashBoardDecisionFramework,
      cashExecutiveAdvisory,
      cashReinvestmentAnalysis,

      dfcExecutiveSnapshot,
      dfcPriorities,
      compressedAdvisory,
      consistencyAudit,

      // Roadmap v1.0 outputs
      causalIntelligence,
      scenarioIntelligence,
      earlyWarningSystem,
      treasurySustainability,

      blockedConclusions,
      allowedConclusions,
      confidenceLevel: reconciliation.confidence,
      auditTrail,
      lineageHash,
      cashIntelligenceLineageHash: lineageHash,
      causalReferences: [lineageHash],
      score: legacySust.resilienceScore,
      runwayMonths: universalIndicators.cashRunwayInstitucional.months
    };

    return output;
  }

  private static generateLineageHash(inputs: any[]): string {
    const rawStr = inputs.map(i => String(i)).join('|');
    let hash = 0;
    for (let i = 0; i < rawStr.length; i++) {
      const char = rawStr.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return 'lineage_dfc_' + Math.abs(hash).toString(16);
  }
}
