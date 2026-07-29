import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { SimulationExecutiveSummary } from './simulation/SimulationExecutiveSummary';
import { SimulationResultTable } from './simulation/SimulationResultTable';
import { useLoanInvestmentSimViewModel } from '../../viewmodels/useLoanInvestmentSimViewModel';
import { StatusBadge } from '../Common';

export function LoanInvestmentSimPage(props?: any) {
  const { state, computed } = useLoanInvestmentSimViewModel(props);

  return (
    <ExecutivePageTemplate
      header={{
        title: 'Simulador de Financiamentos & Investimentos (EAA)',
        subtitle: 'Modelagem Estratégica de Empréstimos, Retorno de CAPEX e Impacto Patrimonial',
        badge: 'SIMULATION EAA — L4 READY'
      }}
    >
      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Simulador de CAPEX Ativo" />
          <StatusBadge status="Verde" label="Cenário Homologado" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Nível 1 & 2: Síntese de Simulação */}
        <SimulationExecutiveSummary
          amount={state.amount}
          monthlyPayment={computed.monthlyPayment}
          roi={computed.computedROI}
        />

        {/* Nível 3: Tabela de Amortização & Projeção */}
        <SimulationResultTable />
      </div>
    </ExecutivePageTemplate>
  );
}
