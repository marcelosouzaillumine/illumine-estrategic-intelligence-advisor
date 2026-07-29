import React from 'react';
import { ExecutiveNarrative } from '../../ui/executive-narrative';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

interface SimulationExecutiveSummaryProps {
  amount: number;
  monthlyPayment: string;
  roi: string;
}

export const SimulationExecutiveSummary: React.FC<SimulationExecutiveSummaryProps> = ({
  amount,
  monthlyPayment,
  roi
}) => {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6">
      <ExecutiveNarrative variant="summary" title="CONSELHO — Síntese Executiva de Simulação de Financiamento">
        A simulação financeira projeta viabilidade com amortização estruturada em 60 meses. O ROI estimado reflete alavancagem positiva para expansão de capacidade.
      </ExecutiveNarrative>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExecutiveMetricCard
          title="Montante Simulado"
          value={formatCurrency(amount)}
          statusBadge="Capital Pretendido"
          description="Volume total de alocação"
        />
        <ExecutiveMetricCard
          title="Parcela Estimada"
          value={`R$ ${monthlyPayment}`}
          statusBadge="60 Meses"
          description="Fluxo mensal de amortização"
        />
        <ExecutiveMetricCard
          title="ROI Projetado (TRI)"
          value={`${roi}%`}
          statusBadge="Retorno Estimado"
          description="Taxa de Retorno de Investimento"
        />
      </div>
    </div>
  );
};
