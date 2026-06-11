import React from 'react';
import { BarChart as RechartsBarChart, Bar, Cell } from 'recharts';
import { ExecutiveChart, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartTooltip } from '../../ui/executive-chart';
import { BalanceSheetWaterfallViewModel } from './view-models';

export function BalanceSheetWaterfallChartSection({
  viewModel,
  formatCurrency
}: {
  viewModel: BalanceSheetWaterfallViewModel;
  formatCurrency: (value: number) => string;
}) {
  return (
    <ExecutiveChart 
      title="Capital de Giro"
      description="Estrutura de Liquidez e Capital de Giro"
      height={250}
      className="col-span-1 md:col-span-2 lg:col-span-1"
      empty={!viewModel.data || viewModel.data.length === 0}
    >
      <RechartsBarChart data={viewModel.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <ExecutiveChartGrid vertical={false} />
        <ExecutiveChartXAxis dataKey="name" />
        <ExecutiveChartTooltip formatter={(value: number) => formatCurrency(value)} />
        <Bar dataKey="value">
          {viewModel.data && viewModel.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ExecutiveChart>
  );
}
