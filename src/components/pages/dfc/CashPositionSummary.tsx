import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveBadge } from '../../ui/executive-badge';

interface CashPositionSummaryProps {
  netOperatingCashFlow: number;
  fci?: number;
  fcf?: number;
  netVariation?: number;
  narrativaExecutiva?: string;
  formatCurrency: (val: number) => string;
}

export const CashPositionSummary: React.FC<CashPositionSummaryProps> = ({
  netOperatingCashFlow,
  fci = 0,
  fcf = 0,
  netVariation,
  narrativaExecutiva,
  formatCurrency
}) => {
  const calculatedNetVariation = netVariation ?? (netOperatingCashFlow + fci + fcf);

  return (
    <div className="space-y-8">
      {/* Bloco de Síntese de Nível Conselho */}
      <ExecutiveSurface variant="default" elevation="sm" className="p-6 md:p-8 rounded-[24px]">
        <div className="flex items-center justify-between gap-4 mb-3">
          <ExecutiveHeading as="h3" className="text-moduleTitle">
            Síntese Executiva de Geração de Caixa & Liquidez
          </ExecutiveHeading>
          <ExecutiveBadge variant="info">Nível Conselho</ExecutiveBadge>
        </div>
        <ExecutiveText variant="bodyLarge" as="p" className="max-w-[85ch] text-executive-primary leading-relaxed">
          {narrativaExecutiva || 'A geração operacional de caixa reflete a capacidade de conversão da receita em liquidez efetiva, atestando a sustentabilidade das operações correntes sem dependência de capital de terceiros.'}
        </ExecutiveText>
      </ExecutiveSurface>

      {/* Grid de KPIs Executivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExecutiveMetricCard
          title="Fluxo Operacional Líquido (FCO)"
          value={formatCurrency(netOperatingCashFlow)}
          statusBadge={
            <ExecutiveBadge variant={netOperatingCashFlow >= 0 ? 'success' : 'critical'}>
              {netOperatingCashFlow >= 0 ? 'Geração Positiva' : 'Consumo de Caixa'}
            </ExecutiveBadge>
          }
          description="Geração líquida resultante das atividades operacionais"
        />
        <ExecutiveMetricCard
          title="Fluxo de Investimento (FCI)"
          value={formatCurrency(fci)}
          statusBadge={
            <ExecutiveBadge variant={fci <= 0 ? 'info' : 'warning'}>
              {fci <= 0 ? 'Aplicação em Ativos' : 'Desinvestimento'}
            </ExecutiveBadge>
          }
          description="Aquisição ou alienação de ativos imobilizados e CAPEX"
        />
        <ExecutiveMetricCard
          title="Variação Líquida de Caixa"
          value={formatCurrency(calculatedNetVariation)}
          statusBadge={
            <ExecutiveBadge variant={calculatedNetVariation >= 0 ? 'success' : 'critical'}>
              {calculatedNetVariation >= 0 ? 'Superávit no Ano' : 'Déficit no Ano'}
            </ExecutiveBadge>
          }
          description="Resultado consolidado da movimentação financeira no período"
        />
      </div>
    </div>
  );
};
