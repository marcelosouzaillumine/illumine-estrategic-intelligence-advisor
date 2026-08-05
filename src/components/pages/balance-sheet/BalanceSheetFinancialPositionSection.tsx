import React from 'react';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { formatCurrency } from '../../../lib/utils';
import { ExecutiveIntelligenceOutput } from '../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';

interface Props {
  bpSummary: any;
  diagnostics: ExecutiveIntelligenceOutput | null;
}

export function BalanceSheetFinancialPositionSection({ bpSummary, diagnostics }: Props) {
  if (!bpSummary) return null;

  const currentLiquidity = bpSummary.passivoCirculante > 0 ? bpSummary.ativoCirculante / bpSummary.passivoCirculante : 0;

  const metrics = [
    { label: 'Ativo Total', value: bpSummary.ativoTotal },
    { label: 'Passivo Total', value: bpSummary.passivoTotal },
    { label: 'Patrimônio Líquido', value: bpSummary.patrimonioLiquido },
    { label: 'Capital de Giro Líquido', value: bpSummary.ativoCirculante - bpSummary.passivoCirculante },
    { label: 'Necessidade Cap. Giro', value: (bpSummary.clientes + bpSummary.estoques) - (bpSummary.fornecedores + (bpSummary.obrigacoesTrabalhistas || 0) + (bpSummary.tributos || 0)) },
    { label: 'Saldo de Tesouraria', value: bpSummary.caixaEquivalentes - (bpSummary.passivosFinanceiros || 0) },
  ];

  return (
    <div className="flex flex-col mb-8">
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Financial Position Overview</ExecutiveHeading>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-surface p-4 rounded-xl border border-border flex flex-col">
            <ExecutiveText as="span" variant="label" className="text-secondary mb-1">{m.label}</ExecutiveText>
            <ExecutiveText as="span" variant="bodyLarge" className="font-semibold text-foreground">
              {formatCurrency(m.value)}
            </ExecutiveText>
          </div>
        ))}
      </div>

      <div className="bg-surface-container/30 p-4 rounded-xl border border-border/50">
        <ExecutiveText as="p" variant="bodyStandard" className="text-primary italic">
          "Para cada R$1,00 de obrigação de curto prazo, a empresa possui {formatCurrency(currentLiquidity).replace('R$', '').trim()} em ativos circulantes."
        </ExecutiveText>
      </div>
    </div>
  );
}
