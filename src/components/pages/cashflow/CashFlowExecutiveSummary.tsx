import React from 'react';
import { ExecutiveNarrative } from '../../ui/executive-narrative';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

interface CashFlowExecutiveSummaryProps {
  currentBalance: number;
  projectedInflow: number;
}

export const CashFlowExecutiveSummary: React.FC<CashFlowExecutiveSummaryProps> = ({
  currentBalance,
  projectedInflow
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <ExecutiveNarrative variant="summary" title="CONSELHO — Gestão Estratégica de Fluxo de Caixa">
        O saldo consolidado de caixa garante folga operacional para o horizonte dos próximos 12 meses.
      </ExecutiveNarrative>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExecutiveMetricCard
          title="Saldo Consolidado de Caixa"
          value={formatCurrency(currentBalance)}
          statusBadge="Liquidez Garantida"
          description="Disponibilidades em conta e aplicações"
        />
        <ExecutiveMetricCard
          title="Entrada Mensal Projetada"
          value={formatCurrency(projectedInflow)}
          statusBadge="Projeção Recorrente"
          description="Faturamento líquido estimado"
        />
      </div>
    </div>
  );
};
