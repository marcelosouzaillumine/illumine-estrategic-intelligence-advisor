import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { CashFlowExecutiveSummary } from './cashflow/CashFlowExecutiveSummary';
import { useCashFlowPageViewModel } from '../../viewmodels/useCashFlowPageViewModel';
import { StatusBadge } from '../Common';

export function CashFlowPage(props?: any) {
  const { state } = useCashFlowPageViewModel(props);

  return (
    <ExecutivePageTemplate
      header={{
        title: 'Gestão de Fluxo de Caixa (EAA)',
        subtitle: 'Monitoramento de Posição de Liquidez, Projeção de Entradas e Controle de Saídas',
        badge: 'CASH FLOW EAA — L4 READY'
      }}
    >
      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Fluxo de Caixa Ativo" />
          <StatusBadge status="Verde" label="Liquidez Projetada" />
        </div>
      </div>

      <div className="space-y-8">
        <CashFlowExecutiveSummary
          currentBalance={state.currentBalance}
          projectedInflow={state.projectedMonthlyInflow}
        />
      </div>
    </ExecutivePageTemplate>
  );
}
