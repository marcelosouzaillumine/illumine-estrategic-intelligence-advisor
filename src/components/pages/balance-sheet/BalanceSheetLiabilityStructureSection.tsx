import React from 'react';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveIntelligenceOutput } from '../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { ExecutiveExposureCard } from '../../ui/executive-exposure-card';

export type BalanceSheetLiabilityStructureSectionProps = {
  bpSummary: any;
  diagnostics: ExecutiveIntelligenceOutput | null;
};

export const BalanceSheetLiabilityStructureSection = ({ bpSummary, diagnostics }: BalanceSheetLiabilityStructureSectionProps) => {
  if (!bpSummary || !diagnostics) return null;

  const { passivoTotal, passivoCirculante, fornecedores, obrigacoesTrabalhistas = 0, tributos = 0 } = bpSummary;

  const getRatio = (value: number) => passivoTotal > 0 ? (value / passivoTotal) * 100 : 0;

  let debtProfileMessage = "O passivo não apresenta concentração estrutural definida.";
  const operationalLiabilityRatio = diagnostics.indicators.find(i => i.id === 'operational_liability_ratio')?.value || 0;
  
  if (operationalLiabilityRatio > 0.5) {
    debtProfileMessage = "O passivo está concentrado em obrigações operacionais, sem evidência de forte dependência financeira externa para a manutenção das obrigações correntes.";
  } else if (operationalLiabilityRatio < 0.2) {
    debtProfileMessage = "O passivo apresenta forte característica de alavancagem financeira, com baixa participação das obrigações operacionais espontâneas no total das dívidas.";
  } else {
    debtProfileMessage = "A estrutura de capital de terceiros apresenta equilíbrio entre obrigações financeiras e operacionais.";
  }

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Liability Structure Intelligence</ExecutiveHeading>

      <ExecutiveExposureCard
        title="Perfil de Obrigações"
        subtitle="Mapeamento da qualidade e vencimento das obrigações assumidas."
        metrics={[
          {
            label: 'Passivo Circulante / Passivo Total (Curto Prazo)',
            percentage: getRatio(passivoCirculante),
            colorClass: 'bg-critical'
          },
          {
            label: 'Fornecedores / Passivo Total',
            percentage: getRatio(fornecedores),
            colorClass: 'bg-success'
          },
          {
            label: 'Trabalhista / Passivo Total',
            percentage: getRatio(obrigacoesTrabalhistas),
            colorClass: 'bg-warning'
          },
          {
            label: 'Tributos / Passivo Total',
            percentage: getRatio(tributos),
            colorClass: 'bg-insight'
          }
        ]}
      />

      <div className="bg-surface-container/30 p-4 mt-6 rounded-xl border border-border/50">
        <ExecutiveText as="p" variant="bodyStandard" className="text-primary italic">
          "{debtProfileMessage}"
        </ExecutiveText>
      </div>
    </div>
  );
};
