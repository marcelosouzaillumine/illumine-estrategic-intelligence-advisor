import React from 'react';
import { BarChart as RechartsBarChart, Bar, Cell } from 'recharts';
import { ExecutiveChart, ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartTooltip } from '../../ui/executive-chart';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { BalanceSheetWaterfallViewModel } from './view-models';

export function BalanceSheetWaterfallChartSection({
  viewModel,
  formatCurrency
}: {
  viewModel: BalanceSheetWaterfallViewModel;
  formatCurrency: (value: number) => string;
}) {
  return (
    <ExecutiveSurface padding="md" radius="md" className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-lg tracking-tight leading-none text-foreground">Capital de Giro</h3>
        <p className="text-foreground/70 text-sm leading-snug">Estrutura de Liquidez e Capital de Giro</p>
      </div>
      <ExecutiveChart height={250} empty={!viewModel.data || viewModel.data.length === 0}>
      <RechartsBarChart data={viewModel.data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <ExecutiveChartGrid vertical={false} />
        <ExecutiveChartXAxis dataKey="name" />
        <ExecutiveChartTooltip formatter={(value: number) => formatCurrency(value)} />
        <Bar dataKey="value" barSize={32}>
          {viewModel.data && viewModel.data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
          ))}
        </Bar>
      </RechartsBarChart>
      </ExecutiveChart>
    </ExecutiveSurface>
  );
}
