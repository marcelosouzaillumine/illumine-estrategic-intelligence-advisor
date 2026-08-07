// @ts-nocheck
import React from 'react';
import { BalanceSheetCompositionViewModel } from './view-models';
import { ExecutiveDistributionCard } from '../../ui/executive-distribution-card';

export function BalanceSheetCompositionChartsSection({
  viewModel,
  formatCurrency
}: {
  viewModel: BalanceSheetCompositionViewModel;
  formatCurrency: (value: number) => string;
}) {
  return (
    <>
      <ExecutiveDistributionCard 
        title="Composição do Ativo"
        subtitle="Distribuição do Capital Aplicado"
        data={viewModel.assetsData || []}
        formatValue={formatCurrency}
        empty={!viewModel.assetsData || viewModel.assetsData.length === 0}
      />

      <ExecutiveDistributionCard 
        title="Composição do Passivo"
        subtitle="Origem dos Recursos"
        data={viewModel.liabilitiesData || []}
        formatValue={formatCurrency}
        empty={!viewModel.liabilitiesData || viewModel.liabilitiesData.length === 0}
      />
    </>
  );
}
