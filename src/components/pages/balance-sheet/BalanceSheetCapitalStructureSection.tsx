import React from 'react';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveIntelligenceOutput } from '../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';
import { ExecutiveExposureCard } from '../../ui/executive-exposure-card';

export type BalanceSheetCapitalStructureSectionProps = {
  bpSummary: any;
  diagnostics: ExecutiveIntelligenceOutput | null;
};

export const BalanceSheetCapitalStructureSection = ({ bpSummary, diagnostics }: BalanceSheetCapitalStructureSectionProps) => {
  if (!bpSummary || !diagnostics) return null;

  const capitalStructure = diagnostics.evidence?.capitalStructure || {};
  let dependencyClassification = 'Muito Baixa';
  const dep = capitalStructure.dependencyRatio || 0;
  if (dep > 0.8) dependencyClassification = 'Crítica';
  else if (dep > 0.6) dependencyClassification = 'Alta';
  else if (dep > 0.4) dependencyClassification = 'Moderada';
  else if (dep > 0.2) dependencyClassification = 'Baixa';

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Capital Structure Intelligence</ExecutiveHeading>

      <ExecutiveExposureCard
        title="Estrutura de Capital e Endividamento"
        subtitle="Avaliação da dependência de capital de terceiros e cobertura patrimonial."
        metrics={[
          {
            label: 'Dependência de Capital de Terceiros',
            percentage: dep * 100,
            colorClass: dep > 0.6 ? 'bg-critical' : (dep > 0.4 ? 'bg-warning' : 'bg-success')
          },
          {
            label: 'Autonomia Financeira (PL/Ativo)',
            percentage: (bpSummary.ativoTotal > 0 ? bpSummary.patrimonioLiquido / bpSummary.ativoTotal : 0) * 100,
            colorClass: 'bg-insight'
          }
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-surface p-4 rounded-xl border border-border">
          <ExecutiveText as="span" variant="label" className="text-secondary mb-1">Dependência de Terceiros</ExecutiveText>
          <ExecutiveText as="span" variant="bodyLarge" className={`font-semibold ${dep > 0.6 ? 'text-critical' : 'text-foreground'}`}>
            {dependencyClassification}
          </ExecutiveText>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <ExecutiveText as="span" variant="label" className="text-secondary mb-1">Cobertura do Ativo Permanente</ExecutiveText>
          <ExecutiveText as="span" variant="bodyLarge" className="font-semibold text-foreground">
            {(capitalStructure.permanentAssetCoverage || 0).toFixed(2)}x
          </ExecutiveText>
          <ExecutiveText as="span" variant="microLabel" className="text-secondary mt-1 block">PL / Ativo Não Circulante</ExecutiveText>
        </div>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <ExecutiveText as="span" variant="label" className="text-secondary mb-1">Alavancagem Patrimonial</ExecutiveText>
          <ExecutiveText as="span" variant="bodyLarge" className="font-semibold text-foreground">
            {(capitalStructure.patrimonialLeverage || 0).toFixed(2)}x
          </ExecutiveText>
          <ExecutiveText as="span" variant="microLabel" className="text-secondary mt-1 block">Ativo Total / PL</ExecutiveText>
        </div>
      </div>

      <div className="bg-surface-container/30 p-4 mt-6 rounded-xl border border-border/50">
        <ExecutiveText as="p" variant="bodyStandard" className="text-primary italic">
          "Cada R$1,00 de capital próprio sustenta R${(capitalStructure.patrimonialLeverage || 0).toFixed(2)} em ativos. A dependência de terceiros é classificada como {dependencyClassification}."
        </ExecutiveText>
      </div>
    </div>
  );
};
