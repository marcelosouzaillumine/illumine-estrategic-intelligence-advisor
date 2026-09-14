// src/core/runtime/governance/dlpa/DLPAFiduciaryInterpretationEngine.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor
// Main orchestrator for DLPA Fiduciary Interpretation.

import { FinancialRuntimeContext } from '../../../../capabilities/financial/runtime/financial-context/FinancialRuntimeContextTypes';
import { DistributionEligibilityEngine, DistributionEligibilityResult } from './DistributionEligibilityEngine';
import { PatrimonialIntegrityEngine, PatrimonialIntegrityReport, CapitalPreservationStatus } from './PatrimonialIntegrityEngine';
import { CapitalRetentionClassificationEngine, CapitalRetentionClassification } from './CapitalRetentionClassificationEngine';
import { DLPAHistoricalConsistencyEngine, HistoricalCycleMetrics } from './DLPAHistoricalConsistencyEngine';
import { LifecycleConsistencyValidator } from '../../../../core/runtime/lifecycle';


export interface DLPAFiduciaryOutput {
  retentionClassification: CapitalRetentionClassification;
  distributionEligibility: DistributionEligibilityResult;
  patrimonialIntegrityStatus: CapitalPreservationStatus;
  preservationRatio: number | null;
  capitalSupportRatio: number | 'NOT_AVAILABLE';
  preservationRatioReliability: 'RELIABLE' | 'PRESERVATION_RATIO_NOT_RELIABLE' | 'INSUFFICIENT_PATRIMONIAL_BASE';
  fiduciaryWarnings: string[];
  blockedConclusions: string[];
  allowedConclusions: string[];
  causalDrivers: string[];
  governanceNarrative: string;
  institutionalStage: 'SURVIVAL_STAGE_CAPITAL_STRUCTURE' | 'EMERGENCY_CAPITAL_PRESERVATION' | 'STABLE_CAPITAL_STRUCTURE' | 'GROWTH_CAPITAL_STRUCTURE';
  capitalProtectionStatus: 'STRONG_CAPITAL_PROTECTION' | 'MEDIUM_CAPITAL_PROTECTION' | 'WEAK_CAPITAL_PROTECTION' | 'CAPITAL_UNDER_COLLAPSE';
  lineageHash: string;
  confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'RESTRICTED';
  contextCompleteness: 'FULL' | 'PARTIAL' | 'MISSING';
  auditTrail: string[];
  rawCapitalStatus?: string;
  semanticCapitalStatus?: string;
  resolvedGovernanceStatus?: string;
  semanticSource?: string;
}


export class DLPAFiduciaryInterpretationEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static evaluate(params: {
    context: FinancialRuntimeContext | undefined;
    dlpaData: any[];
    netIncome: number;
    retainedEarnings: number;
    totalDistributed: number;
    startingEquity: number;
    endingEquity: number;
    capitalInjections: number;
    operatingCashFlow: number;
    capitalSocial: number;
    lucrosPrejuizos: number;
    historicalCycles: HistoricalCycleMetrics[];
    semanticSource?: string;
  }): DLPAFiduciaryOutput {
    const {
      context,
      dlpaData,
      netIncome,
      retainedEarnings,
      totalDistributed,
      startingEquity,
      endingEquity,
      capitalInjections,
      operatingCashFlow,
      capitalSocial,
      lucrosPrejuizos,
      historicalCycles,
      semanticSource,
    } = params;

    if (context?.lifecycleProfile && semanticSource === 'LEGACY') {
      console.error(`[SEMANTIC_SOURCE_CONTRADICTION] CRITICAL: lifecycleProfile is present but semanticSource is LEGACY`);
    }

    const auditTrail: string[] = ['Iniciando avaliação fiduciária da DLPA.'];
    const fiduciaryWarnings: string[] = [];
    const blockedConclusions: string[] = [];
    const allowedConclusions: string[] = [];
    const causalDrivers: string[] = [];

    // 1. Context Completeness Check
    let contextCompleteness: 'FULL' | 'PARTIAL' | 'MISSING' = 'FULL';
    let confidenceLevel: 'HIGH' | 'MODERATE' | 'LOW' | 'RESTRICTED' = 'HIGH';

    if (!context) {
      contextCompleteness = 'PARTIAL';
      confidenceLevel = 'LOW';
      fiduciaryWarnings.push('FinancialRuntimeContext incompleto');
      auditTrail.push('Aviso: FinancialRuntimeContext ausente. Aplicada degradação fiduciária.');
    } else {
      if (context.contextualConfidence === 'LOW' || context.contextualConfidence === 'RESTRICTED') {
        confidenceLevel = 'LOW';
        contextCompleteness = 'PARTIAL';
        fiduciaryWarnings.push('FinancialRuntimeContext incompleto');
      }
      auditTrail.push('FinancialRuntimeContext injetado e validado.');
    }

    // 2. Evaluate Patrimonial Integrity
    const integrityReport = PatrimonialIntegrityEngine.evaluate({
      startingEquity,
      endingEquity,
      capitalSocial,
      netIncome,
      lucrosPrejuizos,
    });
    auditTrail.push('Integridade patrimonial avaliada.');
    fiduciaryWarnings.push(...integrityReport.warnings);

    // 3. Evaluate Distribution Eligibility
    const lucrosAcumulados = lucrosPrejuizos > 0 ? lucrosPrejuizos : 0;
    const reservasLucro = endingEquity - capitalSocial - lucrosAcumulados; // Estimate reserves
    const distributionEligibility = DistributionEligibilityEngine.evaluate({
      netIncome,
      lucrosAcumulados,
      reservasLucro: reservasLucro > 0 ? reservasLucro : 0,
      startingEquity,
      endingEquity,
      operatingCashFlow,
    });
    
    console.log('DLPA ELIGIBILITY DEBUG:', {
      netIncome, lucrosAcumulados, reservasLucro, startingEquity, endingEquity, operatingCashFlow,
      distributionEligibility
    });
    auditTrail.push('Elegibilidade distributiva avaliada.');

    // 4. Evaluate Historical Consistency
    const consistencyReport = DLPAHistoricalConsistencyEngine.evaluate(historicalCycles);
    auditTrail.push('Consistência histórica longitudinal avaliada.');
    fiduciaryWarnings.push(...consistencyReport.warnings);

    // 5. Classify Capital Retention
    const retentionClassification = CapitalRetentionClassificationEngine.classify({
      netIncome,
      distributableBaseExists: lucrosAcumulados > 0 || reservasLucro > 0,
      operatingCashFlow,
      preservationStatus: integrityReport.preservationStatus,
      totalDistributed,
    });
    auditTrail.push(`Retenção de capital classificada como: ${retentionClassification}`);

    // 6. Apply Fail-Closed Blocks & Conclusions
    const isDeteriorated =
      netIncome <= 0 ||
      integrityReport.preservationStatus === 'SEVERELY_ERODED' ||
      integrityReport.preservationStatus === 'CAPITAL_COLLAPSE_RISK' ||
      operatingCashFlow <= 0 ||
      !(lucrosAcumulados > 0 || reservasLucro > 0);

    if (isDeteriorated || consistencyReport.persistentStructuralFragility) {
      blockedConclusions.push(
        'CONSERVATIVE_GOVERNANCE_INFERENCE',
        'STRATEGIC_RETENTION_INFERENCE',
        'HEALTHY_PATRIMONIAL_PRESERVATION_INFERENCE',
        'DISTRIBUTIVE_MATURITY_INFERENCE',
        'PAYOUT_RATIO_INFERENCE',
        'DISTRIBUTIVE_PRESSURE_INFERENCE',
        'PREDATORY_DISTRIBUTION_INFERENCE',
        'DIVIDEND_GOVERNANCE_ANALYSIS'
      );
      auditTrail.push('Bloqueio fiduciário ativado devido a fragilidades financeiras/operacionais.');
    } else {
      allowedConclusions.push(
        'STANDARD_RETENTION_INTERPRETATION',
        'ELIGIBLE_FOR_DISTRIBUTION'
      );
    }

    // Integração Cross-Statement DFC (Capitalização vs Fluxo de Financiamento)
    // Assume que capitalInjections devem vir de atividades de financiamento
    if (capitalInjections > 0) {
      auditTrail.push(`Injeção de capital identificada: ${capitalInjections}. Necessita reconciliação com Fluxo de Financiamento (DFC).`);
    }

    // Causal drivers extraction
    if (netIncome <= 0) causalDrivers.push('DÉFICIT_LÍQUIDO_OPERACIONAL');
    if (operatingCashFlow <= 0) causalDrivers.push('FLUXO_CAIXA_OPERACIONAL_NEGATIVO');
    if (integrityReport.preservationStatus === 'SEVERELY_ERODED' || integrityReport.preservationStatus === 'CAPITAL_COLLAPSE_RISK') {
      causalDrivers.push('EROSÃO_RELEVANTE_PL');
    }
    if (totalDistributed > 0 && netIncome <= 0) causalDrivers.push('DISTRIBUIÇÃO_SEM_LUCRO_GERADOR');
    if (consistencyReport.persistentStructuralFragility) causalDrivers.push('FRAGILIDADE_LONGITUDINAL_ESTRUTURAL');

    // 7. Resolve institutionalStage
    let institutionalStage: DLPAFiduciaryOutput['institutionalStage'] = 'STABLE_CAPITAL_STRUCTURE';
    if (integrityReport.preservationStatus === 'CAPITAL_COLLAPSE_RISK' || endingEquity <= 0 || (integrityReport.preservationStatus === 'SEVERELY_ERODED' && netIncome < 0)) {
      institutionalStage = 'SURVIVAL_STAGE_CAPITAL_STRUCTURE';
    } else if (integrityReport.preservationStatus === 'SEVERELY_ERODED') {
      institutionalStage = 'EMERGENCY_CAPITAL_PRESERVATION';
    } else if (netIncome > 0 && operatingCashFlow > 0 && integrityReport.preservationStatus === 'PRESERVED') {
      institutionalStage = 'GROWTH_CAPITAL_STRUCTURE';
    }

    // 8. Generate Fiduciary-Aware Narrative
    let governanceNarrative = '';
    if (retentionClassification === 'STRATEGIC_RETENTION') {
      governanceNarrative = 'A ausência de distribuição de lucros reflete uma decisão deliberada e planejada de reinvestimento do superávit econômico para fortalecimento da estrutura de capital, amparada por liquidez e geração de caixa operacional saudáveis.';
    } else if (retentionClassification === 'FORCED_RETENTION') {
      governanceNarrative = 'A ausência de distribuições está primariamente associada à inexistência de superávit econômico distribuível (lucro acumulado ou reservas), caracterizando uma retenção obrigatória imposta pelas regras fiduciárias e contábeis de governança.';
    } else if (retentionClassification === 'EMERGENCY_CAPITAL_PRESERVATION') {
      governanceNarrative = 'A total retenção de recursos decorre da severa fragilidade e erosão patrimonial do período, atuando como medida impositiva de sobrevivência e preservação de capital emergencial diante do esgotamento das reservas.';
    } else if (retentionClassification === 'SURVIVAL_STAGE_CAPITAL_STRUCTURE') {
      if (endingEquity > 0) {
        governanceNarrative = 'A companhia encontra-se em fase inicial de capitalização, apresentando erosão patrimonial relevante decorrente dos investimentos necessários para estruturação operacional. Apesar do prejuízo do exercício, o patrimônio líquido permanece positivo, preservando a continuidade patrimonial da organização.';
      } else {
        governanceNarrative = 'A estrutura de capital encontra-se em estágio de sobrevivência devido ao colapso ou exaustão do PL. A retenção total é compulsória e decorre da completa ausência de capacidade econômica, demandando imediato reforço patrimonial externo.';
      }
    } else if (retentionClassification === 'UNSUSTAINABLE_PRESERVATION') {
      governanceNarrative = 'A ausência de distribuição decorre de severa fragilidade de liquidez e fluxo de caixa operacional negativo. A preservação de recursos é insustentável no longo horizonte, refletindo o aprisionamento de capital na operação para cobrir ineficiências comerciais.';
    } else {
      governanceNarrative = 'A política distributiva e de retenção de capital opera em regime moderado, necessitando de formalização e alinhamento de metas estratégicas de governança patrimonial de longo horizonte.';
    }

    // Universal fiduciary principle: se prejuízo e PL preservado através de capitalização
    if (netIncome < 0 && integrityReport.capitalSupportRatio !== 'NOT_AVAILABLE') {
      if (integrityReport.capitalSupportRatio >= 1.0) {
        governanceNarrative = 'A manutenção do patrimônio líquido positivo decorreu predominantemente da capitalização dos sócios e não da geração operacional de resultado econômico. Não houve lucro distribuível no período, impossibilitando retenção estratégica ou distribuição de dividendos.';
      } else {
        governanceNarrative = 'A empresa apresentou prejuízo líquido superior às capitalizações realizadas, resultando em erosão patrimonial residual. A ausência de distribuições reflete a completa inexistência de capacidade econômica.';
      }
    } else if (netIncome < 0 && totalDistributed === 0 && integrityReport.preservationStatus === 'SEVERELY_ERODED') {
      // General fall-back for severe erosion during a loss year
      governanceNarrative = 'A ausência de distribuições decorre exclusivamente da inexistência de superávit econômico e da fragilidade patrimonial observada, caracterizando ausência de capacidade distributiva em vez de retenção estratégica.';
    }

    // ELSA Early Stage Narrative Override
    const isEarly = context?.lifecycleProfile?.lifecycleStage === 'INITIAL_CAPITALIZATION' || context?.lifecycleProfile?.lifecycleStage === 'EARLY_GROWTH';
    if (isEarly) {
      governanceNarrative = 'A companhia encontra-se em fase inicial de capitalização, apresentando erosão patrimonial relevante decorrente dos investimentos necessários para estruturação operacional. Apesar do prejuízo do exercício, o patrimônio líquido permanece positivo, preservando a continuidade patrimonial da organização.';
    }

    // ELSA Semantic Protection Consistency Check
    if (context?.lifecycleProfile) {
      const validation = LifecycleConsistencyValidator.validate(context.lifecycleProfile, [
        governanceNarrative,
        integrityReport.preservationStatus,
        integrityReport.capitalProtectionStatus,
      ]);
      if (!validation.isValid) {
        throw new Error(`EARLY_STAGE_SEMANTIC_CONTRADICTION: ${validation.violations[0].message}`);
      }
    }

    // 9. Lineage Hash
    const rawLineage = `${startingEquity}_${endingEquity}_${netIncome}_${totalDistributed}_${contextCompleteness}_${blockedConclusions.length}`;
    let hash = 0;
    for (let i = 0; i < rawLineage.length; i++) {
      hash = (hash << 5) - hash + rawLineage.charCodeAt(i);
      hash = hash & hash;
    }
    const lineageHash = `DLPA_FID_${Math.abs(hash).toString(16).toUpperCase()}`;

    return {
      retentionClassification,
      distributionEligibility,
      patrimonialIntegrityStatus: integrityReport.preservationStatus,
      preservationRatio: integrityReport.capitalPreservationIndex,
      capitalSupportRatio: integrityReport.capitalSupportRatio,
      preservationRatioReliability: integrityReport.preservationRatioReliability,
      fiduciaryWarnings,
      blockedConclusions,
      allowedConclusions,
      causalDrivers,
      governanceNarrative,
      institutionalStage,
      capitalProtectionStatus: integrityReport.capitalProtectionStatus,
      lineageHash,
      confidenceLevel,
      contextCompleteness,
      auditTrail,
      rawCapitalStatus: semanticSource === 'ELSA'
        ? (integrityReport.capitalProtectionStatus === 'WEAK_CAPITAL_PROTECTION' ? 'Erosão Patrimonial' : 'Proteção de Capital')
        : (integrityReport.capitalProtectionStatus === 'WEAK_CAPITAL_PROTECTION' ? 'High Capital Erosion' : 'Strong Capital Protection'),
      semanticCapitalStatus: context?.lifecycleProfile?.capitalStatus?.semanticLabel || 'Capitalização em Consolidação',
      resolvedGovernanceStatus: context?.lifecycleProfile?.governanceStatus?.semanticLabel || 'Governança em Estruturação',
      semanticSource: context?.lifecycleProfile ? 'ELSA' : undefined
    };
  }
}


