import { CashIntelligenceRuntimeOutput, CashConfidenceLevel } from './CashIntelligenceTypes';
import { CashFlowReconciliationEngine } from './CashFlowReconciliationEngine';
import { ArtificialLiquidityDetector } from './ArtificialLiquidityDetector';
import { LiquidityClassificationEngine } from './LiquidityClassificationEngine';
import { OperationalSustainabilityRuntime } from './OperationalSustainabilityRuntime';
import { InstitutionalContinuityEngine } from './InstitutionalContinuityEngine';
import { FiduciaryCashInterpreter } from './FiduciaryCashInterpreter';

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
    historicalCyclesCount: number
  ): CashIntelligenceRuntimeOutput {
    const auditTrail: string[] = ['Execution started at FiduciaryCashIntelligenceRuntime'];

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
      dreNetIncome,
      dreEbitda,
      bpCashEquivalentsStart,
      bpCashEquivalentsEnd,
      fco,
      fci,
      fcf,
      workingCapitalVariation,
      receivables,
      inventory,
      availableCash,
      thirdPartyFunding,
      equityFunding,
      historicalCyclesCount
    ];
    const lineageHash = this.generateLineageHash(hashInputs);
    auditTrail.push(`Lineage hash generated: ${lineageHash}`);

    // Se a reconciliação estiver completamente bloqueada (Fail-Closed)
    if (!reconciliation.isReconcilable && reconciliation.reconciliationStatus === 'BLOCKED') {
      const blockedOutput: CashIntelligenceRuntimeOutput = {
        isAvailable: false,
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
        reconciliationAlerts: reconciliation,
        operationalSustainability: {
          isSustained: false,
          selfFinancingCapacity: 'NONE',
          operationalCashConsistency: 'INSUFFICIENT_HISTORY',
          operationalFragilityIndex: 100,
          dependencyTrend: 'CRITICAL',
          resilienceScore: 0,
          longitudinalConsistency: 'Divergência de reconciliação impede análise de consistência.'
        },
        continuityRisk: {
          continuityRisk: 'CRITICAL',
          hasRuptureRisk: true,
          projectedRunwayMonths: 0,
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

    // 2. Detecção de Liquidez Artificial
    const artificial = ArtificialLiquidityDetector.evaluate(
      fco,
      fcf,
      fci,
      thirdPartyFunding,
      equityFunding
    );
    auditTrail.push(`Artificial liquidity checked. Detected: ${artificial.isArtificial}`);

    // 3. Sustentabilidade Operacional
    const sustainability = OperationalSustainabilityRuntime.evaluate(
      fco,
      fcf,
      dreNetIncome,
      workingCapitalVariation,
      historicalCyclesCount
    );
    auditTrail.push(`Operational sustainability evaluated. Resilience score: ${sustainability.resilienceScore}`);

    // 4. Continuidade Institucional (Survival Horizon)
    const continuity = InstitutionalContinuityEngine.evaluate(
      fco,
      fci,
      fcf,
      availableCash,
      dreNetIncome,
      thirdPartyFunding,
      equityFunding,
      historicalCyclesCount
    );
    auditTrail.push(`Institutional continuity assessed. Continuity risk: ${continuity.continuityRisk}`);

    // 5. Classificação de Liquidez (Reordenada para injetar runway/resilience/rupture na severidade)
    const classification = LiquidityClassificationEngine.evaluate(
      fco,
      fci,
      fcf,
      availableCash,
      reconciliation.confidence,
      continuity.projectedRunwayMonths,
      sustainability.resilienceScore,
      continuity.hasRuptureRisk,
      artificial.isArtificial
    );
    auditTrail.push(`Liquidity classification: ${classification.classification}`);

    // 6. Parecer e Narrativa Fiduciária
    const narrative = FiduciaryCashInterpreter.interpret(
      classification.classification,
      artificial.isArtificial,
      reconciliation,
      sustainability,
      continuity
    );
    auditTrail.push('Fiduciary narrative interpreted');

    // Compilação de Conclusões Permitidas e Bloqueadas
    const blockedConclusions = [...new Set([...artificial.blockedConclusions, ...narrative.blockedInterpretations])];
    const allowedConclusions: string[] = [];

    if (fco > 0) {
      allowedConclusions.push('OPERATIONAL_GENERATION');
    }
    if (classification.classification === 'OPERATIONAL_SUSTAINABLE' || classification.classification === 'STRATEGIC_EXPANSION') {
      allowedConclusions.push('HEALTHY_LIQUIDITY', 'SUSTAINABLE_GROWTH');
    }

    const output: CashIntelligenceRuntimeOutput = {
      isAvailable: true,
      liquidityClassification: classification,
      artificialLiquidityDetected: artificial,
      reconciliationAlerts: reconciliation,
      operationalSustainability: sustainability,
      continuityRisk: continuity,
      fiduciaryNarrative: narrative,
      blockedConclusions,
      allowedConclusions,
      confidenceLevel: reconciliation.confidence,
      auditTrail,
      lineageHash,
      cashIntelligenceLineageHash: lineageHash,
      causalReferences: [lineageHash],
      score: sustainability.resilienceScore
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
