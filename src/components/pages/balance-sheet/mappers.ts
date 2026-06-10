import { BalanceSheetIndicator } from './types';
import { BalanceSheetIndicatorViewModel } from './view-models';

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
