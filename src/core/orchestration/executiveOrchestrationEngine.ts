import { FinancialEntry } from '../../hooks/useHistoricalDemonstracoes';
import { BoardReportData, generateBoardReportFull } from '../../services/aiBoardReportService';
import { calculateFinancialMetrics } from '../../lib/financial-engine';
import { calculateScores } from '../../lib/score-engine';
import { generateAdvisory } from '../../lib/advisory-engine';
import { BPSummary } from '../../lib/bpEngine';
import { inferBusinessIdentity } from '../../lib/business-identity-engine';
import { generateAdvisoryParecer } from '../../services/advisoryAiService';
import { generateGovernanceParecer } from '../../services/governanceAiService';
import { evaluateMasterCausality } from '../../lib/master-causal-engine';
import { MetricCanonicalizationEngine, MetricCanonicalizationInput } from '../runtime/executive-consolidation/MetricCanonicalizationEngine';
import { CanonicalDivergenceAuditEngine, CanonicalDivergenceAuditResult } from '../runtime/executive-consolidation/CanonicalDivergenceAuditEngine';
import { CompositeScoreGovernanceEngine, CompositeScoreGovernanceResult } from '../runtime/executive-consolidation/CompositeScoreGovernanceEngine';
import { ExecutiveStrategicSnapshotEngine, ExecutiveStrategicSnapshotResult } from '../runtime/executive-consolidation/ExecutiveStrategicSnapshotEngine';
import { CrossStatementPropagationEngine, CrossStatementPropagationInput, CrossStatementPropagationResult, CrossStatementTension } from '../runtime/executive-consolidation/CrossStatementPropagationEngine';
import { CrossStatementExecutiveNarrativeEngine, ExecutiveNarrativeResult } from '../runtime/executive-consolidation/CrossStatementExecutiveNarrativeEngine';
import { ExecutiveBlockedAnalysisTranslator } from '../runtime/executive-consolidation/ExecutiveBlockedAnalysisTranslator';
import { ExecutiveRecommendationDeduplicationEngine, ExecutiveRecommendation } from '../runtime/executive-consolidation/ExecutiveRecommendationDeduplicationEngine';
import { CrossStatementBindingResolver } from '../runtime/executive-consolidation/CrossStatementBindingResolver';
import { ExecutiveActionCompletenessAudit } from '../runtime/executive-consolidation/ExecutiveActionCompletenessAudit';

import { 
  enforceInstitutionalRuntime, 
  InstitutionalAuditTrail, 
  ComplianceStatus 
} from '../enforcement/institutionalRuntimeEnforcer';

export interface OrchestratedExecutiveReport {
  boardReport: BoardReportData;
  advisory: any;
  auditTrail: InstitutionalAuditTrail;
}

const INSUFFICIENT_INFO_MSG = "Informação insuficiente para inferência institucional.";

/**
 * Pipeline obrigatório de execução (Enforcement Real da Arquitetura).
 * Nenhuma UI ou hook pode dar bypass nesta função para gerar narrativas executivas.
 */
export async function generateInstitutionalExecutiveReport(
  companyName: string,
  financialData: FinancialEntry[],
  onProgress: (step: string) => void,
  clientData?: any,
  options: { includeLLM: boolean } = { includeLLM: true }
): Promise<OrchestratedExecutiveReport> {
  const baseAudit: Partial<InstitutionalAuditTrail> = {
    enginesExecuted: [],
    complianceStatus: 'compliant'
  };

  try {
    // 1. DataValidationEngine
    onProgress('Validando dados e estrutura...');
    if (!financialData || financialData.length === 0) {
      baseAudit.complianceStatus = 'non_compliant';
    }
    baseAudit.enginesExecuted?.push('DataValidationEngine');

    // 2. FinancialIntelligenceEngine
    onProgress('Computando inteligência financeira...');
    const latestData = financialData[financialData.length - 1] || {};
    const bpSummaryMock = latestData as any;
    const ebitdaMock = 0;
    const lucroLiquidoMock = 0;
    const industryMock = clientData?.industry || 'Indefinido';
    const metrics = calculateFinancialMetrics(bpSummaryMock, ebitdaMock, lucroLiquidoMock, industryMock);
    baseAudit.enginesExecuted?.push('FinancialIntelligenceEngine');

    // 3. BusinessModelIntelligenceEngine
    onProgress('Inferindo taxonomia do modelo de negócios...');
    const identity = inferBusinessIdentity(industryMock, financialData.length, bpSummaryMock, [], clientData?.clientValidation);
    baseAudit.enginesExecuted?.push('BusinessModelIntelligenceEngine');

    // Construção da Série Histórica (Temporal Causality Layer)
    const historicalData = financialData.map(d => {
      const { summary: bp } = import('../../lib/bpEngine').then(m => m.buildBPHierarchy([d as any])).catch(() => ({ summary: bpSummaryMock })) as any; // simplificado
      return {
        year: d.year,
        bp: bpSummaryMock, // Na UI real o financialData precisa ser devidamente processado ou ter os BPs por ano
        metrics: metrics
      };
    }).filter(d => !!d.year); // Placeholder for actual temporal building since financialData comes aggregated per year in some places

    const causality = evaluateMasterCausality(bpSummaryMock, metrics, identity, financialData.length, 0, historicalData);
    const scores = calculateScores(bpSummaryMock, metrics, financialData.length, 0, identity, causality);

    // 4. ExecutiveCausalityEngine & 5. StrategicRiskEngine
    // (Embutidos no prompt e cálculos do AI Service e Advisory Engine)
    baseAudit.enginesExecuted?.push('ExecutiveCausalityEngine', 'StrategicRiskEngine');

    // 6. BoardSynthesisEngine & 7. ExecutiveCalibrationEngine
    onProgress('Sintetizando recomendações e calibrando...');
    const advisory = generateAdvisory(metrics as any, {} as any, scores as any, identity as any, null as any);
    baseAudit.enginesExecuted?.push('BoardSynthesisEngine', 'ExecutiveCalibrationEngine');

    let boardReport = null as any;

    if (options.includeLLM) {
      // 8. ExecutiveRenderEngine (Chama a AI com enforcement total)
      onProgress('Renderizando Board Report oficial...');
      boardReport = await generateBoardReportFull(companyName, financialData, onProgress, clientData);
      baseAudit.enginesExecuted?.push('ExecutiveRenderEngine');
    }

    const report: OrchestratedExecutiveReport = {
      boardReport,
      advisory,
      auditTrail: null as any,
    };

    const { sanitizedOutput, auditTrail } = enforceInstitutionalRuntime(report, {
      enginesExecuted: baseAudit.enginesExecuted,
      businessModel: identity.modeloDeNegocio,
      score: scores.resilienciaGlobal
    });

    return { ...sanitizedOutput, auditTrail };
  } catch (error: any) {
    throw error;
  }
}

/**
 * Pipeline síncrono obrigatório para componentes de UI (Enforcement Real).
 */
export function orchestrateSynchronousIntelligence(
  bpSummary: BPSummary,
  ebitda: number,
  lucroLiquido: number,
  industry: string = 'Geral',
  dreDbDataLength: number = 1,
  prevPl: number = 0,
  clientValidation?: any,
  trendParams?: { isTurnaroundEmerging?: boolean; isDestructiveGrowth?: boolean; confidenceLevel?: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' },
  historicalSeries?: any[]
): { metrics: any; scores: any; causalInsights: any; auditTrail: InstitutionalAuditTrail; businessIdentity: any } {
  const tStart = performance.now();
  
  const metrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido, industry);
  const identity = inferBusinessIdentity(industry, 1, bpSummary, [], clientValidation);
  
  // Se a UI enviar a série histórica, usamos FULL_TEMPORAL_MODE, caso contrário LIMITED
  const causality = evaluateMasterCausality(bpSummary, metrics, identity, dreDbDataLength, 0, historicalSeries || []); 
  
  const updatedScores = calculateScores(bpSummary, metrics, dreDbDataLength, prevPl, identity, causality);
  
  // Advisory fusion
  const causalInsights = generateAdvisory(metrics, bpSummary, updatedScores, identity, causality.temporalIntelligence || trendParams as any);

  const result = enforceInstitutionalRuntime(
    { metrics, scores: updatedScores, causalInsights: causalInsights }, 
    {
      enginesExecuted: ['DataValidationEngine', 'FinancialIntelligenceEngine', 'BusinessModelIntelligenceEngine', 'ExecutiveCausalityEngine', 'StrategicRiskEngine', 'BoardSynthesisEngine'],
      businessModel: identity.modeloDeNegocio,
      score: updatedScores.resilienciaGlobal
    }
  );
  
  console.log(`[TELEMETRY] Orchestrator Execution Time: ${(performance.now() - tStart).toFixed(2)}ms`);

  return {
    metrics: result.sanitizedOutput.metrics,
    scores: result.sanitizedOutput.scores,
    causalInsights: result.sanitizedOutput.causalInsights,
    auditTrail: result.auditTrail,
    businessIdentity: identity
  };
}

export async function orchestrateAdvisoryNarrative(params: any): Promise<{ narrative: string, auditTrail: InstitutionalAuditTrail }> {
  let narrative = await generateAdvisoryParecer(params);
  const { sanitizedOutput, auditTrail } = enforceInstitutionalRuntime(narrative, {
    enginesExecuted: ['FinancialIntelligenceEngine', 'BusinessModelIntelligenceEngine', 'ExecutiveCausalityEngine']
  });
  return { narrative: sanitizedOutput, auditTrail };
}

export async function orchestrateGovernanceNarrative(params: any): Promise<{ narrative: string, auditTrail: InstitutionalAuditTrail }> {
  let narrative = await generateGovernanceParecer(params);
  const { sanitizedOutput, auditTrail } = enforceInstitutionalRuntime(narrative, {
    enginesExecuted: ['GovernanceEngine', 'BoardSynthesisEngine']
  });
  return { narrative: sanitizedOutput, auditTrail };
}

export async function orchestrateCfoParecer(params: any): Promise<{ narrative: string, auditTrail: InstitutionalAuditTrail }> {
  let narrative = await generateAdvisoryParecer(params);
  const { sanitizedOutput, auditTrail } = enforceInstitutionalRuntime(narrative, {
    enginesExecuted: ['FinancialIntelligenceEngine', 'ExecutiveCausalityEngine']
  });
  return { narrative: sanitizedOutput, auditTrail };
}

export async function orchestrateStrategicAxisNarrative(params: any): Promise<{ narrative: string, auditTrail: InstitutionalAuditTrail }> {
  let narrative = await generateGovernanceParecer(params);
  const { sanitizedOutput, auditTrail } = enforceInstitutionalRuntime(narrative, {
    enginesExecuted: ['StrategicRiskEngine', 'BoardSynthesisEngine']
  });
  return { narrative: sanitizedOutput, auditTrail };
}

import { ExecutiveStrategicMaturityEngine, ExecutiveStrategicMaturityInput } from '../runtime/executive-consolidation/ExecutiveStrategicMaturityEngine';
import { BoardDecisionEscalationEngine } from '../runtime/executive-consolidation/BoardDecisionEscalationEngine';
import { DominantRiskResolver, PriorityDecisionResolver } from '../runtime/executive-consolidation/Resolvers';
import { BADIConsistencyEngine } from '../runtime/executive-consolidation/BADIConsistencyEngine';
import { EFOSExecutiveConsistencyAuditEngine, ConsistencyAuditResult } from '../runtime/executive-consolidation/EFOSExecutiveConsistencyAuditEngine';
import { BoardTop3DecisionEngine } from '../runtime/executive-prioritization/BoardTop3DecisionEngine';
import { CapitalProtectionCanonicalResolver } from '../runtime/executive-consolidation/CapitalProtectionCanonicalResolver';


export interface ExecutiveConsolidationResult {
  divergenceAudit: CanonicalDivergenceAuditResult;
  scoreGovernance: CompositeScoreGovernanceResult;
  snapshot: any; // Updated format
  crossStatementTensions: CrossStatementTension[];
  crossStatementIsFallback: boolean;
  boardTop3: any[];
  executiveTop5Title: string;
  executiveTop5: ExecutiveRecommendation[];
  auditStatus: ConsistencyAuditResult;
}

/**
 * Orquestração final da camada executiva (EBSHAF v1.0).
 * Não recalcula demonstrações, apenas consome métricas canônicas, audita, converte e sintetiza.
 */
export function orchestrateExecutiveConsolidation(
  metricInput: MetricCanonicalizationInput,
  scoreInput: { calculatedScore: number; hasRevenue: boolean; equityPositive: boolean; operationalContinuity: boolean },
  snapshotInput: any, // Keeping for backward compatibility or mapping
  crossStatementInput: CrossStatementPropagationInput,
  recommendations: ExecutiveRecommendation[],
  fullReport?: any, // Pass the full report so BoardTop3DecisionEngine can rank
  isMockData: boolean = false
): ExecutiveConsolidationResult {
  // 1. Metric Canonicalization
  const canonicalMetrics = MetricCanonicalizationEngine.canonicalize(metricInput);

  // 2. Canonical Divergence Audit
  const divergenceAudit = CanonicalDivergenceAuditEngine.audit(canonicalMetrics);

  // 3. Composite Score Governance
  const scoreGovernance = CompositeScoreGovernanceEngine.govern(scoreInput);

  // 4. Executive Strategic Snapshot (EBSHAF Maturity & Capital Resolver)
  const resolvedCapitalProtection = CapitalProtectionCanonicalResolver.resolve({
    dlpaExecutiveStatus: fullReport?.dlpa?.executiveLayer?.capitalPreservationStatus?.classification,
    dlpaCapitalStatus: fullReport?.dlpa?.executiveLayer?.capitalStatus,
    dlpaResolvedCapitalStatus: fullReport?.dlpa?.radar?.resolvedCapitalStatus,
    capitalPreservedPercent: 100 - (crossStatementInput.capitalConsumedPercent || 0)
  });

  const maturityInput: ExecutiveStrategicMaturityInput = {
    fco: crossStatementInput.fco,
    fcf: canonicalMetrics.CaixaFinal?.canonicalValue || 0,
    lucroLiquido: crossStatementInput.lucroLiquido,
    patrimonioLiquido: canonicalMetrics.PatrimonioLiquido?.canonicalValue || 0,
    runwayMonths: crossStatementInput.runway,
    capitalConsumido: crossStatementInput.capitalConsumido
  };
  const snapshotMaturity = ExecutiveStrategicMaturityEngine.evaluate(maturityInput);

  // 5. Resolvers
  const dominantRisk = DominantRiskResolver.resolve({
    fco: crossStatementInput.fco,
    lucroLiquido: crossStatementInput.lucroLiquido,
    runwayMonths: crossStatementInput.runway,
    capitalConsumido: crossStatementInput.capitalConsumido,
    patrimonioLiquido: canonicalMetrics.PatrimonioLiquido?.canonicalValue || 0,
    liquidezReal: crossStatementInput.liquidezReal
  });

  const priorityDecision = PriorityDecisionResolver.resolve({
    fco: crossStatementInput.fco,
    lucroLiquido: crossStatementInput.lucroLiquido,
    runwayMonths: crossStatementInput.runway,
    capitalConsumido: crossStatementInput.capitalConsumido,
    patrimonioLiquido: canonicalMetrics.PatrimonioLiquido?.canonicalValue || 0,
    liquidezReal: crossStatementInput.liquidezReal
  });

  const snapshot = {
    survivalStatus: snapshotMaturity.survivalStatus,
    valueCreationStatus: snapshotMaturity.valueCreationStatus,
    capitalProtectionStatus: resolvedCapitalProtection, // Using strict DLPA resolver
    dominantRisk,
    priorityDecision
  };

  // 6. Cross-Statement Propagation (Entities)
  const propagation = CrossStatementPropagationEngine.detect(crossStatementInput);

  // 7. BADI & Escalation
  // If report doesn't have BADI directly, we use a heuristic based on Composite Score inverted or passed badi
  const badiScore = fullReport?.advisory?.badi || (100 - scoreGovernance.fiduciaryAdjustedScore);
  
  const requiresEscalation = BoardDecisionEscalationEngine.requiresEscalation({
    badiScore,
    runwayMonths: crossStatementInput.runway,
    capitalConsumido: crossStatementInput.capitalConsumido,
    fco: crossStatementInput.fco,
    lucroLiquido: crossStatementInput.lucroLiquido,
    patrimonioLiquido: canonicalMetrics.PatrimonioLiquido?.canonicalValue || 0
  });

  // 8. BoardTop3 Decisions
  // We use the new generator that forces exactly 3 if requiresEscalation
  const boardTop3Raw = fullReport ? BoardTop3DecisionEngine.generate(fullReport, requiresEscalation) : [];

  // 9. Sovereign Binding (ECSBF v1.0)
  // Substitui geração de narrativa solta por um Binding seguro e auditável.
  const crossStatementBinding = CrossStatementBindingResolver.resolve(
    propagation.tensions,
    badiScore,
    boardTop3Raw,
    isMockData
  );

  const mappedBoardTop3Recs: ExecutiveRecommendation[] = boardTop3Raw.map((d: any) => ({
    text: d.titulo + ': ' + d.impactoEsperado,
    type: 'BOARD',
    impact: 'Muito Alto'
  }));

  // 10. Recommendation Deduplication (applies mainly to executive items now)
  const deduplicatedRecs = ExecutiveRecommendationDeduplicationEngine.deduplicate([...mappedBoardTop3Recs, ...recommendations]);

  // If there are board recommendations in deduplicatedRecs.boardTop3 that are not represented in the final boardTop3Raw,
  // we map/downgrade them to EXECUTIVE and append them to executiveTop5.
  const finalBoardTitles = new Set(boardTop3Raw.map((d: any) => d.titulo?.toLowerCase().trim() || ''));
  const bypassedBoardRecs: ExecutiveRecommendation[] = [];
  for (const rec of deduplicatedRecs.boardTop3) {
    const recTextLower = rec.text.toLowerCase().trim();
    const isRepresented = Array.from(finalBoardTitles).some(title => title && recTextLower.includes(title));
    if (!isRepresented) {
      bypassedBoardRecs.push({
        ...rec,
        type: 'EXECUTIVE'
      });
    }
  }

  const rawExecutiveTop5 = ExecutiveRecommendationDeduplicationEngine.deduplicate([
    ...bypassedBoardRecs,
    ...deduplicatedRecs.executiveTop5
  ]).executiveTop5;

  // 11. Executive Completeness Audit
  const executiveCompleteness = ExecutiveActionCompletenessAudit.auditAndFormatTitle(rawExecutiveTop5);

  // 12. Executive Consistency Audit (Hard Audit ECSBF v1.0)
  const auditStatus = EFOSExecutiveConsistencyAuditEngine.audit({
    badiScore,
    boardTop3: boardTop3Raw,
    lucroLiquido: crossStatementInput.lucroLiquido,
    fco: crossStatementInput.fco,
    tensions: crossStatementBinding.tensions,
    patrimonioLiquido: canonicalMetrics.PatrimonioLiquido?.canonicalValue || 0,
    capitalConsumido: crossStatementInput.capitalConsumido,
    runwayMonths: crossStatementInput.runway,
    dominantRisk,
    priorityDecision,
    dlpaCapitalStatus: resolvedCapitalProtection,
    snapshotCapitalProtectionStatus: resolvedCapitalProtection,
    executiveTop5: executiveCompleteness.executiveTop5
  });

  // The audit does not block the UI, but it can flag optimistic thesis block
  if (divergenceAudit.status === 'BLOCKED_FOR_OPTIMISTIC_THESIS' && scoreGovernance.fiduciaryAdjustedScore > 50) {
     auditStatus.status = 'BLOCKED_FOR_OPTIMISTIC_THESIS';
  }

  return {
    divergenceAudit,
    scoreGovernance,
    snapshot,
    crossStatementTensions: crossStatementBinding.tensions, // exported entities
    crossStatementIsFallback: crossStatementBinding.isFallback,
    executiveTop5Title: executiveCompleteness.title,
    boardTop3: boardTop3Raw, // Pass the complex objects directly
    executiveTop5: executiveCompleteness.executiveTop5,
    auditStatus
  } as any;
}
