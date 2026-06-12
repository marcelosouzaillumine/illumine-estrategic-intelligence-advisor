import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { 
  ExecutiveAreaChart, ExecutiveArea, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartTooltip 
} from '../../ui/executive-chart';
import { ExecutiveHistoricalEvolutionCard } from '../../ui/executive-historical-evolution-card';
import { ExecutiveAnalyticalHighlightItem } from '../../ui/executive-analytical-highlights';
import { BalanceSheetEvolutionViewModel } from './view-models';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { TrendingDown } from 'lucide-react';
import { ExecutiveChartSemanticPalette } from '../../../core/theme/ExecutiveChartSemanticPalette';
import { HistoricalInsightEngine } from '../../../services/FiduciaryRuntimeAdapter';
import type { HistoricalSeries } from '../../../services/FiduciaryRuntimeAdapter';

export function BalanceSheetEvolutionAnalysisSection({
  viewModel,
  formatCurrency,
  fiduciaryStatus = 'NEUTRAL' // Propagated from parent page ideally
}: {
  viewModel: BalanceSheetEvolutionViewModel;
  formatCurrency: (value: number) => string;
  fiduciaryStatus?: any;
}) {
  if (!viewModel.hasEnoughData || !viewModel.chartData || viewModel.chartData.length === 0) {
    return (
      <ExecutiveEmptyState 
        icon={<TrendingDown />}
        title="Evolução histórica insuficiente"
        description="São necessários ao menos dois exercícios para gerar inferências longitudinais consistentes."
      />
    );
  }

  // Build Series for Insight Engine
  const seriesDict: Record<string, HistoricalSeries> = {
    assets: { metricName: 'Ativo', data: viewModel.chartData.map(d => ({ year: d.year, value: d.ativo })) },
    liabilities: { metricName: 'Passivo', data: viewModel.chartData.map(d => ({ year: d.year, value: d.passivo })) },
    equity: { metricName: 'Patrimônio', data: viewModel.chartData.map(d => ({ year: d.year, value: d.patrimonioLiquido })) }
  };

  const insight = HistoricalInsightEngine.generateExecutiveNarrative(
    { module: 'BP', globalFiduciaryStatus: fiduciaryStatus },
    seriesDict
  );

  const legendItems = [
    { label: 'Ativo', colorKey: 'asset' as const },
    { label: 'Passivo', colorKey: 'liability' as const },
    { label: 'Patrimônio Líquido', colorKey: 'equity' as const }
  ];

  const highlightsItems = viewModel.highlights.map((change, i) => (
    <ExecutiveAnalyticalHighlightItem 
      key={i}
      label={change.label}
      value={change.valueFormatted}
      trend={change.tone === 'positive' ? 'up' : change.tone === 'negative' ? 'down' : 'neutral'}
      trendValue={`${change.horizontalAnalysis.toFixed(2)}%`}
    />
  ));

  return (
    <ExecutiveHistoricalEvolutionCard
      title="Análise de Evolução Histórica"
      description="Comparativo Estrutural de Ativos, Passivos e Capital Próprio"
      legendItems={legendItems}
      insight={insight}
      highlights={{ items: highlightsItems }}
    >
      <div style={{ height: 320 }} className="w-full mt-4 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ExecutiveAreaChart data={viewModel.chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAtivo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ExecutiveChartSemanticPalette.asset} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={ExecutiveChartSemanticPalette.asset} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPassivo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ExecutiveChartSemanticPalette.liability} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={ExecutiveChartSemanticPalette.liability} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ExecutiveChartSemanticPalette.equity} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={ExecutiveChartSemanticPalette.equity} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <ExecutiveChartGrid vertical={false} />
            <ExecutiveChartXAxis dataKey="year" dy={10} />
            <ExecutiveChartTooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: 'var(--color-muted-foreground)', fontWeight: 'bold' }}
            />
            <ExecutiveArea type="monotone" dataKey="ativo" name="Ativo" stroke={ExecutiveChartSemanticPalette.asset} strokeWidth={2} fillOpacity={1} fill="url(#colorAtivo)" />
            <ExecutiveArea type="monotone" dataKey="passivo" name="Passivo" stroke={ExecutiveChartSemanticPalette.liability} strokeWidth={2} fillOpacity={1} fill="url(#colorPassivo)" />
            <ExecutiveArea type="monotone" dataKey="patrimonioLiquido" name="PL" stroke={ExecutiveChartSemanticPalette.equity} strokeWidth={2} fillOpacity={1} fill="url(#colorPl)" />
          </ExecutiveAreaChart>
        </ResponsiveContainer>
      </div>
    </ExecutiveHistoricalEvolutionCard>
  );
}
