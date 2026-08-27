import { PatrimonialIndicator } from '../../../../core/runtime/governance/bp/BalanceSheetFinancialMetricsEngine';
import { FinancialPositionPureViewModel, FinancialIndicator } from '../../../../core/experience/contracts/FinancialPositionPureViewModel';
import { BalanceSheetExecutiveViewModel } from '../../../../types/executive/BalanceSheetExecutiveViewModel';

// `FinancialOverviewRoot`, `FinancialDiagnosisRoot`, `FinancialSignalsRoot`,
// `HistoricalEvolutionRoot`, `ExecutiveQuestionsRoot` and `TechnicalEvidenceRoot`
// (rendered by ExecutiveProductRenderer via FinancialPositionProduct's layers)
// are the only thing BalanceSheetPage actually renders when data is present —
// the BalanceSheet*Section components imported alongside them are unused.
// Those roots expect FinancialPositionPureViewModel, which used to come from
// the now-deleted FinancialPositionPureViewModelBuilder. This maps the same
// real indicators BalanceSheetFinancialMetricsEngine already computes (no
// recomputation, no fabricated numbers) into that shape.

const FAMILY_TO_DIAGNOSIS_BUCKET: Record<string, keyof FinancialPositionPureViewModel['diagnosis']> = {
  'Liquidez': 'liquidity',
  'Capital de Giro': 'workingCapital',
  'Estrutura de Capital': 'solvencyAndCapitalStructure',
  'Imobilização': 'assetQuality'
};

function isConcerning(severity: string): boolean {
  return ['CRITICAL', 'ATTENTION', 'TREASURY_STRESS', 'SHORT_TERM_PRESSURE'].includes(severity);
}

function toFinancialIndicator(ind: PatrimonialIndicator): FinancialIndicator {
  return {
    code: ind.metricName,
    name: ind.metricName,
    value: ind.value,
    classification: ind.classification,
    observation: ind.rationale,
    evidence: JSON.stringify(ind.evidence ?? {}),
    financialMeaning: ind.rationale,
    formattedValue: typeof ind.value === 'number' ? ind.value.toFixed(2) : String(ind.value),
    availability: ind.value === 'INSUFFICIENT_DATA' ? 'INSUFFICIENT_DATA' : 'AVAILABLE'
  };
}

export function mapToFinancialPositionPureViewModel(
  indicators: PatrimonialIndicator[],
  historicalSeries: any[] | undefined,
  // Optional: the tested BalanceSheetExecutiveViewModelBuilder output for this
  // same bpSummary/indicators. When present, its validated severity/narrative
  // (already passed through consistency + "no prescriptive language" guards)
  // is used instead of the coarser aggregation below — reuse over re-derivation.
  canonicalViewModel?: BalanceSheetExecutiveViewModel | null
): FinancialPositionPureViewModel {
  const usable = indicators.filter(i => i.value !== 'INSUFFICIENT_DATA');
  const concerning = usable.filter(i => isConcerning(i.severity));
  const healthy = usable.filter(i => !isConcerning(i.severity));

  const overallHealth = canonicalViewModel?.strategicSeverity || (
    concerning.some(i => i.severity === 'CRITICAL' || i.severity === 'TREASURY_STRESS')
      ? 'CRITICAL'
      : concerning.length > 0
        ? 'ATTENTION'
        : usable.length > 0
          ? 'HEALTHY'
          : 'INSUFFICIENT_DATA'
  );
  const narrativeReason = canonicalViewModel?.strategicSeverityReason;
  const executiveOpinion = canonicalViewModel?.executiveOpinion;
  const criticalFactor = canonicalViewModel?.criticalFactor;

  const avgConfidence = usable.length > 0
    ? usable.reduce((s, i) => s + (i.confidence || 0), 0) / usable.length
    : 0;
  const confidenceLabel = avgConfidence >= 85 ? 'HIGH' : avgConfidence >= 60 ? 'MEDIUM' : 'LOW';

  const diagnosis: FinancialPositionPureViewModel['diagnosis'] = {
    liquidity: [],
    solvencyAndCapitalStructure: [],
    workingCapital: [],
    assetQuality: []
  };
  for (const ind of indicators) {
    const bucket = FAMILY_TO_DIAGNOSIS_BUCKET[ind.family];
    if (bucket) diagnosis[bucket].push(toFinancialIndicator(ind));
  }

  const signals = concerning.map(ind => ({
    id: ind.lineageHash,
    title: ind.metricName,
    observation: ind.rationale,
    evidence: JSON.stringify(ind.evidence ?? {}),
    financialMeaning: ind.rationale,
    severity: ind.severity,
    sourceMetric: ind.metricName,
    interpretation: ind.classification
  }));

  const technicalEvidence = indicators
    .filter(i => typeof i.value === 'number')
    .map(i => ({ item: i.metricName, value: i.value as number, type: i.format }));

  const historicalAvailable = !!historicalSeries && historicalSeries.length > 0;

  return {
    executiveSummary: {
      available: usable.length > 0,
      status: {
        classification: overallHealth,
        narrative: executiveOpinion || (usable.length > 0
          ? `${healthy.length} de ${usable.length} indicadores patrimoniais dentro da faixa saudável.`
          : 'Dados patrimoniais insuficientes para diagnóstico.')
      },
      strengths: healthy.map(i => i.metricName),
      attentionPoints: concerning.map(i => i.metricName),
      centralQuestion: {
        question: criticalFactor || (concerning.length > 0
          ? `O que está pressionando ${concerning[0].metricName.toLowerCase()}?`
          : 'A estrutura patrimonial atual sustenta o próximo ciclo de crescimento?')
      }
    },
    score: {
      available: usable.length > 0,
      overall: {
        value: Math.round(avgConfidence),
        classification: overallHealth,
        finalStatus: overallHealth,
        confidence: confidenceLabel,
        explanation: `Composto pela confiança média (${avgConfidence.toFixed(0)}%) dos ${usable.length} indicadores calculados.`,
        structuralEvents: []
      },
      dimensions: {
        liquidity: diagnosis.liquidity,
        solvencyAndCapitalStructure: diagnosis.solvencyAndCapitalStructure,
        workingCapital: diagnosis.workingCapital,
        assetQuality: diagnosis.assetQuality,
        evolution: historicalAvailable ? historicalSeries : []
      },
      methodology: 'BalanceSheetFinancialMetricsEngine (governance/bp) — thresholds fixos por família de indicador.'
    },
    overview: {
      healthStatus: overallHealth,
      confidence: confidenceLabel,
      drivers: concerning.map(i => i.metricName),
      observation: usable.length > 0
        ? `Liquidez, estrutura de capital e capital de giro avaliados a partir de ${usable.length} indicadores reais.`
        : 'Sem dados patrimoniais suficientes.',
      evidence: usable.map(i => i.lineageHash).join(', '),
      financialMeaning: narrativeReason || (concerning.length > 0
        ? `Pontos de atenção concentrados em: ${concerning.map(i => i.metricName).join(', ')}.`
        : 'Nenhum indicador em zona de atenção ou crítica no período.')
    },
    diagnosis,
    signals,
    historicalEvolution: {
      available: historicalAvailable,
      periodCoverage: historicalAvailable ? historicalSeries.length : 0,
      trajectory: historicalAvailable ? historicalSeries : [],
      movements: [],
      executiveContext: historicalAvailable
        ? 'Série histórica real disponível para o cliente.'
        : 'Sem série histórica suficiente para análise de trajetória.'
    },
    executiveQuestions: concerning.map(i => ({
      question: `O que está pressionando ${i.metricName.toLowerCase()}?`,
      relatedMetric: i.metricName
    })),
    technicalEvidence
  };
}
