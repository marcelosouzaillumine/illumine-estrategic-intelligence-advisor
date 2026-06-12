import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ResponsiveContainer } from 'recharts';
import { 
  ExecutiveBarChart, 
  ExecutiveBar, 
  ExecutiveChartGrid,
  ExecutiveChartXAxis,
  ExecutiveChartTooltip
} from '../../ui/executive-chart';
import { ExecutiveHistoricalEvolutionCard } from '../../ui/executive-historical-evolution-card';
import { formatCurrency } from '../../../lib/utils';
import { DREChartsSectionViewModel } from './view-models';
import { ExecutiveChartSemanticPalette } from '../../../core/theme/ExecutiveChartSemanticPalette';
import { HistoricalInsightEngine, HistoricalSeries } from '../../../services/FiduciaryRuntimeAdapter';

interface Props {
  viewModel: DREChartsSectionViewModel;
}

export function DREChartsSection({ viewModel }: Props) {
  const { t } = useLanguage();

  const seriesDict: Record<string, HistoricalSeries> = {
    profit: { metricName: 'Lucro', data: viewModel.data ? viewModel.data.map(d => ({ year: d.year, value: d.lucro })) : [] }
  };

  const insight = HistoricalInsightEngine.generateExecutiveNarrative(
    { module: 'DRE', globalFiduciaryStatus: 'NEUTRAL' }, // Propagate status later if needed
    seriesDict
  );

  return (
    <ExecutiveHistoricalEvolutionCard 
      title={t('dre.evolution.title')}
      description="Receita, EBITDA e Lucro"
      insight={insight}
      legendItems={[
        { label: t('dre.metrics.net_revenue'), colorKey: 'revenue' },
        { label: viewModel.cmvLabel, colorKey: 'liability' },
        { label: t('dre.metrics.ebitda'), colorKey: 'profit' },
        { label: t('dre.metrics.net_result'), colorKey: 'equity' }
      ]}
    >
      <div style={{ height: 300 }} className="w-full mt-4">
        {(!viewModel.data || viewModel.data.length === 0) ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-high/50 rounded-lg">
            <span className="text-muted-foreground text-sm italic">Nenhum dado disponível para este gráfico.</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ExecutiveBarChart data={viewModel.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <ExecutiveChartGrid vertical={false} />
              <ExecutiveChartXAxis dataKey="year" dy={10} />
              <ExecutiveChartTooltip 
                formatter={(value: any) => formatCurrency(Number(value))}
                cursor={{ fill: 'var(--color-muted)', opacity: 0.2 }}
              />
              <ExecutiveBar dataKey="receita" name="Receita Líquida" fill={ExecutiveChartSemanticPalette.revenue} radius={[4, 4, 0, 0]} />
              <ExecutiveBar dataKey="cmv" name={viewModel.cmvLabel} fill={ExecutiveChartSemanticPalette.liability} radius={[4, 4, 0, 0]} />
              <ExecutiveBar dataKey="ebitda" name="EBITDA" fill={ExecutiveChartSemanticPalette.profit} radius={[4, 4, 0, 0]} />
              <ExecutiveBar dataKey="lucro" name="Resultado Líquido" fill={ExecutiveChartSemanticPalette.equity} radius={[4, 4, 0, 0]} />
            </ExecutiveBarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ExecutiveHistoricalEvolutionCard>
  );
}
