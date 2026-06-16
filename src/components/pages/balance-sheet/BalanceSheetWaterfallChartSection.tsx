import React from 'react';
import { ExecutiveChart } from '../../ui/executive-chart';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { BalanceSheetWaterfallViewModel } from './view-models';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';

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
        <ExecutiveHeading as="h3" variant="moduleTitle">Capital de Giro</ExecutiveHeading>
        <ExecutiveText as="p" variant="bodyStandard" className="text-executive-secondary">Estrutura de Liquidez e Capital de Giro</ExecutiveText>
      </div>
      <ExecutiveChart 
        type="bar"
        data={viewModel.data}
        xKey="name"
        series={[{ key: 'value', label: 'Valor', variant: 'primary' }]}
        height={250} 
        empty={!viewModel.data || viewModel.data.length === 0}
        yFormatter={(value: number) => formatCurrency(value)}
      />
    </ExecutiveSurface>
  );
}
