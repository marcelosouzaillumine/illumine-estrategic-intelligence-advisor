import React from 'react';
import { MasterDetailLayout } from '../../../../components/ui/master-detail-layout';
import { PartnerPipelineBoard } from '../../../../components/pages/partners/PartnerPipelineBoard';
import { usePartnerSalesViewModel } from '../../../../viewmodels/usePartnerSalesViewModel';

export function PartnerSalesPage(props?: any) {
  const { state } = usePartnerSalesViewModel(props);

  return (
    <MasterDetailLayout
      title="Gestão Comercial de Parceiros (EFA)"
      subtitle="Funil de Vendas, Comissionamento e Acompanhamento de Performance de Canais"
    >
      <PartnerPipelineBoard
        pipelineTotalValue={state.pipelineTotalValue}
        activeDealsCount={state.activeDealsCount}
      />
    </MasterDetailLayout>
  );
}
