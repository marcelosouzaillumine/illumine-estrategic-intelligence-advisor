import React from 'react';
import { BalanceSheetCompositionViewModel } from './view-models';
import { ExecutiveCompositionChart } from '../../ui/executive-composition-chart';

export function BalanceSheetCompositionChartsSection({
  viewModel,
  formatCurrency
}: {
  viewModel: BalanceSheetCompositionViewModel;
  formatCurrency: (value: number) => string;
}) {
  return (
    <>
      <ExecutiveCompositionChart 
        title="Composição do Ativo"
        description="Distribuição do Capital Aplicado"
        data={viewModel.assetsData || []}
        formatValue={formatCurrency}
        empty={!viewModel.assetsData || viewModel.assetsData.length === 0}
      />

      <ExecutiveCompositionChart 
        title="Composição do Passivo"
        description="Origem dos Recursos"
        data={viewModel.liabilitiesData || []}
        formatValue={formatCurrency}
        empty={!viewModel.liabilitiesData || viewModel.liabilitiesData.length === 0}
      />
    </>
  );
}
