import React from 'react';
import { ExecutiveChart, ExecutiveChartSeries } from '../../ui/executive-chart';
import { ExecutiveChartLegend } from '../../ui/executive-chart-legend';
import { ExecutiveChartInsight } from '../../ui/executive-chart-insight';
import { ExecutiveHistoricalEvolutionCard } from '../../ui/executive-historical-evolution-card';
import { ExecutiveAnalyticalHighlightItem } from '../../ui/executive-analytical-highlights';
import { BalanceSheetEvolutionViewModel } from './view-models';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { TrendingDown } from 'lucide-react';
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

  const chartSeries: ExecutiveChartSeries[] = [
    { key: "ativo", label: "Ativo", variant: "asset" },
    { key: "passivo", label: "Passivo", variant: "liability" },
    { key: "patrimonioLiquido", label: "Patrimônio Líquido", variant: "equity" }
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
      highlights={{ items: highlightsItems }}
    >
      <div className="flex flex-col gap-4">
        {/* V2: Transversal Legend */}
        <div className="flex justify-end">
          <ExecutiveChartLegend series={chartSeries} />
        </div>

        {/* V2: Transversal Chart */}
        <div style={{ height: 320 }} className="w-full relative">
          <ExecutiveChart
            type="area"
            data={viewModel.chartData}
            xKey="year"
            yFormatter={formatCurrency}
            series={chartSeries}
          />
        </div>

        {/* V2: Transversal Insight */}
        {insight && (
          <ExecutiveChartInsight
            title="Insight Analítico"
            description={insight.narrative}
            severity="neutral"
            className="mt-4"
          />
        )}
      </div>
    </ExecutiveHistoricalEvolutionCard>
  );
}
