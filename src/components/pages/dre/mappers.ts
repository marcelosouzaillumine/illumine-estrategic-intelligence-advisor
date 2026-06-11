import { formatCurrency } from '../../../lib/utils';
import {
  DREEconomicDiagnosisInput,
  DRERevenueEconomicStructureInput,
  DREEconomicBurnRateInput,
  DREBreakEvenAnalysisInput,
  DREOperationalAbsorptionInput,
  DREBoardDecisionSupportInput,
  DREExecutiveAdvisoryFullInput,
  DREScaleEfficiencyInput,
  DREEarningsQualityAssessmentInput
} from './types';
import {
  DREEconomicDiagnosisViewModel,
  DRERevenueEconomicStructureViewModel,
  DREEconomicBurnRateViewModel,
  DREBreakEvenAnalysisViewModel,
  DREBoardDecisionSupportViewModel,
  DREExecutiveAdvisorySectionViewModel,
  DREScaleEfficiencyViewModel,
  DREEarningsQualityAssessmentViewModel,
  DREHighlightsViewModel,
  DRETechnicalRowViewModel,
  DRETechnicalLayerViewModel,
  DREChartPointViewModel,
  DREChartsSectionViewModel
} from './view-models';

import { DRETechnicalRowInput } from './types';

export type DREHighlightsInput = {
  receitaBruta: number;
  deducoesReceita: number;
  recLiquida: number;
  custosVar: number;
  margemContrib: number;
  despesasFixas: number;
  pontoEquilibrio: number;
  gapEquilibrio: number;
  margemSegurancaValor: number;
  indiceCoberturaOperacional: number;
  indiceMargemContrib: number;
  cmvLabel: string;
  hasRealData: boolean;
};

export function mapEconomicDiagnosis(input: DREEconomicDiagnosisInput): DREEconomicDiagnosisViewModel {
  return {
    valueCreationAssessment: input.valueCreationAssessment,
    primaryConstraint: input.primaryConstraint,
    recoverabilityAssessment: input.recoverabilityAssessment,
    strategicPriority: input.strategicPriority,
    boardOutlook: input.boardOutlook
  };
}

export function mapRevenueEconomicStructure(input: DRERevenueEconomicStructureInput): DRERevenueEconomicStructureViewModel {
  return {
    available: input.available,
    reason: input.reason as any,
    narrative: input.value?.narrativa
  };
}

export function mapEconomicBurnRate(input: DREEconomicBurnRateInput): DREEconomicBurnRateViewModel {
  const hasBurn = input.value?.monthlyEconomicBurn !== null && input.value?.monthlyEconomicBurn !== undefined;
  return {
    available: input.available,
    reason: input.reason as any,
    narrative: input.value?.narrativa,
    hasBurn,
    monthlyEconomicBurnFormatted: hasBurn ? formatCurrency(input.value!.monthlyEconomicBurn!) : undefined,
    annualEconomicBurnFormatted: hasBurn ? formatCurrency(input.value!.annualEconomicBurn!) : undefined
  };
}

export function mapBreakEvenAnalysis(
  breakEven: DREBreakEvenAnalysisInput, 
  absorption: DREOperationalAbsorptionInput | undefined
): DREBreakEvenAnalysisViewModel {
  let absorptionTone: 'success' | 'warning' | 'critical' = 'critical';
  const classificacao = absorption?.value?.classificacao;
  
  if (classificacao === 'Plena' || classificacao === 'Adequada') {
    absorptionTone = 'success';
  } else if (classificacao === 'Parcial') {
    absorptionTone = 'warning';
  }

  return {
    available: breakEven.available && (breakEven.value?.breakEvenRevenue || 0) > 0,
    reason: breakEven.reason as any,
    narrative: breakEven.value?.narrativa,
    absorptionClassification: classificacao,
    absorptionTone
  };
}

export function mapBoardDecisionSupport(input: DREBoardDecisionSupportInput): DREBoardDecisionSupportViewModel {
  const geraValor = input.geraValor === 'Sim';
  return {
    valueCreationLabel: input.criacaoDeValor || input.geraValor || '—',
    valueCreationTone: geraValor ? 'success' : 'critical',
    sustainabilityLabel: input.faturamentoSustaenta || input.problemaPrincipal || '—',
    balanceGapLabel: input.lacunaEquilibrio || '—',
    primaryConstraintLabel: input.restricaoPrincipal || input.problemaPrincipal || '—',
    primaryOpportunityLabel: input.oportunidadePrincipal || '—',
    inactionConsequenceLabel: input.consequenciaDaInacao || input.risco || '—',
    inactionTone: geraValor ? 'success' : 'critical',
    boardPriorityLabel: input.prioridadeConselho || input.prioridade || '—'
  };
}

export function mapExecutiveAdvisory(
  fullInput?: DREExecutiveAdvisoryFullInput,
  simpleText?: string
): DREExecutiveAdvisorySectionViewModel {
  if (fullInput) {
    return {
      hasFullAdvisory: true,
      situacaoAtual: fullInput.situacaoAtual,
      restricaoPrincipal: fullInput.restricaoPrincipal,
      oportunidadePrincipal: fullInput.oportunidadePrincipal,
      prioridadeEstrategica: fullInput.prioridadeEstrategica,
      outlook: fullInput.outlook
    };
  }
  
  return {
    hasFullAdvisory: false,
    simpleAdvisoryText: simpleText
  };
}

export function mapScaleEfficiency(input: DREScaleEfficiencyInput, translateFn: (key: string) => string): DREScaleEfficiencyViewModel {
  const recGrowth = input.recGrowth || 0;
  const ebitdaGrowth = input.ebitdaGrowth || 0;
  
  return {
    classificationLabel: translateFn(input.category) || input.category,
    toneClass: input.colorClass || '',
    recGrowthFormatted: input.recGrowth === null ? 'N/A' : `${recGrowth > 0 ? '+' : ''}${recGrowth.toFixed(2)}%`,
    recGrowthTone: recGrowth >= 0 ? 'success' : 'critical',
    ebitdaGrowthFormatted: input.ebitdaGrowth === null ? 'N/A' : `${ebitdaGrowth > 0 ? '+' : ''}${ebitdaGrowth.toFixed(2)}%`,
    ebitdaGrowthTone: ebitdaGrowth >= 0 ? 'success' : 'critical',
    description: input.description
  };
}

export function mapEarningsQuality(input: DREEarningsQualityAssessmentInput): DREEarningsQualityAssessmentViewModel {
  let title = 'Qualidade Média';
  let tone: 'success' | 'critical' | 'neutral' | 'warning' = 'warning';

  if (input.classification === 'HIGH_QUALITY_EARNINGS') {
    title = 'Alta Qualidade (Operacional)';
    tone = 'success';
  } else if (input.classification === 'LOW_QUALITY_EARNINGS') {
    title = 'Baixa Qualidade (Extraordinário)';
    tone = 'critical';
  } else if (input.classification === 'UNDETERMINED_EARNINGS_QUALITY') {
    title = 'Qualidade Indeterminada';
    tone = 'neutral';
  }

  return {
    classificationTitle: title,
    classificationTone: tone,
    rationale: input.rationale,
    recurringRevenueWeight: input.recurringRevenueWeight,
    nonRecurringWeight: input.nonRecurringWeight
  };
}

export function mapHighlights(input: DREHighlightsInput): DREHighlightsViewModel {
  const ico = input.indiceCoberturaOperacional;
  let coberturaTone: 'success' | 'info' | 'warning' | 'critical' = 'critical';
  if (ico >= 100) coberturaTone = 'success';
  else if (ico >= 85) coberturaTone = 'info';
  else if (ico >= 60) coberturaTone = 'warning';

  return {
    receitaBrutaFormatted: formatCurrency(input.receitaBruta),
    deducoesReceitaFormatted: formatCurrency(input.deducoesReceita),
    recLiquidaFormatted: formatCurrency(input.recLiquida),
    custosVarFormatted: formatCurrency(input.custosVar),
    cmvLabel: input.cmvLabel,
    margemContribFormatted: formatCurrency(input.margemContrib),
    margemContribPercent: `${(input.indiceMargemContrib * 100).toFixed(2)}%`,
    despesasFixasFormatted: formatCurrency(input.despesasFixas),
    pontoEquilibrioFormatted: input.hasRealData ? formatCurrency(input.pontoEquilibrio) : '---',
    gapEquilibrioFormatted: input.hasRealData ? formatCurrency(input.gapEquilibrio) : '---',
    margemSegurancaValorFormatted: input.hasRealData ? formatCurrency(input.margemSegurancaValor) : '---',
    indiceCoberturaOperacionalFormatted: input.hasRealData ? `${ico.toFixed(2)}%` : '---',
    coberturaTone
  };
}

export function mapTechnicalRows(inputs: DRETechnicalRowInput[], translateLabel: (k: string) => string): DRETechnicalLayerViewModel {
  const rows: DRETechnicalRowViewModel[] = inputs.map(input => {
    const rawName = input.name || input.conta || input.category || '';
    const translatedName = translateLabel(rawName) || rawName;
    return {
      label: translatedName,
      val: input.val || 0,
      av: input.av || 0,
      ah1: input.ah1,
      ah2: input.ah2,
      ah3: input.ah3,
      level: input.level ?? 1,
      isTotal: (input.level ?? 1) === 1
    };
  });

  return { rows };
}

export function mapChartsSection(data: any[], cmvLabel: string): DREChartsSectionViewModel {
  const chartData: DREChartPointViewModel[] = data.map(d => ({
    year: d.year,
    receita: d.receita || 0,
    cmv: d.cmv || 0,
    ebitda: d.ebitda || 0,
    lucro: d.lucro || 0
  }));

  return {
    data: chartData,
    cmvLabel
  };
}
