import React from 'react';
import { ExecutiveNarrative } from '../../ui/executive-narrative';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { useExecutiveFormatter } from '../../../core/localization';

interface PortfolioExecutiveSummaryProps {
  totalPortfolioValue: number;
  activeAssetsCount: number;
}

export const PortfolioExecutiveSummary: React.FC<PortfolioExecutiveSummaryProps> = ({
  totalPortfolioValue,
  activeAssetsCount
}) => {
  const formatter = useExecutiveFormatter();
  const formatCurrency = (val: number) => formatter.currency(val);

  return (
    <div className="space-y-6">
      <ExecutiveNarrative variant="summary" title="CONSELHO — Alocação de Ativos & Gestão de Portfólio">
        O portfólio corporativo consolida 8 unidades estratégicas de negócio com valorização líquida positiva.
      </ExecutiveNarrative>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExecutiveMetricCard
          title="Valor Total do Portfólio"
          value={formatCurrency(totalPortfolioValue)}
          statusBadge="Avaliação Consolidada"
          description="Soma do valor de mercado dos ativos"
        />
        <ExecutiveMetricCard
          title="Ativos Gerenciados"
          value={`${activeAssetsCount} Empresas / Unidades`}
          statusBadge="Portfólio Ativo"
          description="Divisões de negócio consolidadas"
        />
      </div>
    </div>
  );
};
