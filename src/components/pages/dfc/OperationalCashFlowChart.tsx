import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveAccordion } from '../../ui/executive-accordion';
import { useExecutiveFormatter } from '@/core/localization';

interface OperationalCashFlowChartProps {
  fco?: number;
  fci?: number;
  fcf?: number;
  formatCurrency?: (val: number) => string;
}

export const OperationalCashFlowChart: React.FC<OperationalCashFlowChartProps> = ({
  fco = 0,
  fci = 0,
  fcf = 0,
  formatCurrency
}) => {
  const formatter = useExecutiveFormatter();
  const format = formatCurrency || ((val: number) => formatter.currency(val));

  return (
    <ExecutiveSurface className="p-6">
      <ExecutiveHeading as="h3" className="text-h3 mb-4">
        Análise Causal & Evolução do Fluxo de Caixa
      </ExecutiveHeading>
      <div className="space-y-4">
        <ExecutiveAccordion
          title="Demonstrativo de Atividades Operacionais vs. Investimento vs. Financiamento"
          subtitle="Análise Detalhada das Movimentações por Categoria Contábil"
          defaultExpanded={true}
        >
          <div className="p-4 bg-surface-container/50 rounded-md text-sm text-executive-secondary space-y-2">
            <p>
              • <strong>Atividades Operacionais (FCO):</strong> {fco >= 0 ? `Geração líquida de ${format(fco)} proveniente das operações correntes.` : `Consumo líquido de ${format(Math.abs(fco))} nas atividades operacionais.`}
            </p>
            <p>
              • <strong>Atividades de Investimento (FCI):</strong> {fci < 0 ? `Investimento líquido de ${format(Math.abs(fci))} em bens do ativo imobilizado e projetos.` : fci > 0 ? `Entrada líquida de ${format(fci)} decorrente de desinvestimentos.` : 'Sem movimentação líquida relevante no período de investimento.'}
            </p>
            <p>
              • <strong>Atividades de Financiamento (FCF):</strong> {fcf < 0 ? `Amortização de principal de empréstimos e aportes de ${format(Math.abs(fcf))}.` : fcf > 0 ? `Captação líquida de recursos no total de ${format(fcf)}.` : 'Sem movimentação líquida relevante no período de financiamento.'}
            </p>
          </div>
        </ExecutiveAccordion>
      </div>
    </ExecutiveSurface>
  );
};
