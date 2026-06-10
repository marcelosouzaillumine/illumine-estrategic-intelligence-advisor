import { BalanceSheetIndicator } from './types';
import { BalanceSheetIndicatorViewModel, BalanceSheetRiskDivergenceViewModel, BalanceSheetRiskDivergenceTone } from './view-models';

export function mapIndicatorsToViewModels(params: {
  indicators?: BalanceSheetIndicator[];
  metricNames: string[];
  resolveLabel: (metricName: string) => string;
}): BalanceSheetIndicatorViewModel[] {
  if (!params.indicators) return [];

  return params.metricNames
    .map((metricName): BalanceSheetIndicatorViewModel | null => {
      const ind = params.indicators?.find((i) => i.metricName === metricName);
      if (!ind) return null;

      return {
        key: metricName,
        label: params.resolveLabel(metricName),
        value: ind.value,
        format: ind.format,
        rationale: ind.rationale,
      };
    })
    .filter((v): v is BalanceSheetIndicatorViewModel => v !== null);
}

export function mapRiskDivergenceToViewModel(params: {
  globalScore?: number;
  patrimonialClassification?: string;
  indicators?: BalanceSheetIndicator[];
  resolveLabel: (key: string) => string;
  resolveImpact: (metric: string) => string;
}): BalanceSheetRiskDivergenceViewModel {
  const score = params.globalScore || 0;
  let mathLabel = 'Crítico';
  if (score >= 80) mathLabel = 'Resiliente';
  else if (score >= 65) mathLabel = 'Estável';
  else if (score >= 50) mathLabel = 'Vulnerável';

  const classStr = params.patrimonialClassification || '';
  let tone: BalanceSheetRiskDivergenceTone = 'critical';
  if (classStr.includes('RESILIENT')) tone = 'primary';
  else if (classStr.includes('STABLE')) tone = 'success';
  else if (classStr.includes('VULNERABLE')) tone = 'warning';

  const criticalOffenders = (params.indicators || [])
    .filter(i => i.classification === 'CRITICAL' || i.classification === 'Crítica' || i.classification === 'Crítico')
    .map(i => ({
      metricName: params.resolveLabel(i.metricName),
      classification: params.resolveLabel(i.classification || ''),
      impact: params.resolveImpact(i.metricName)
    }));

  return {
    mathClassificationLabel: mathLabel,
    fiduciaryClassificationLabel: params.resolveLabel(classStr),
    fiduciaryClassificationTone: tone,
    globalScore: score,
    criticalOffenders
  };
}

import { BalanceSheetInstitutionalContextViewModel } from './view-models';

export function mapInstitutionalContextToViewModel(
  context: any,
  maturidadeOverride?: string
): BalanceSheetInstitutionalContextViewModel {
  if (!context) {
    return {
      segment: 'Geral',
      businessModel: 'Não Identificado',
      capitalIntensity: 'Não Identificada',
      stage: maturidadeOverride || 'Pendente'
    };
  }
  return {
    segment: context.segment || 'Geral',
    businessModel: context.businessModel || 'Não Identificado',
    capitalIntensity: context.capitalIntensity || 'Não Identificada',
    stage: maturidadeOverride || context.stage || 'Pendente'
  };
}
