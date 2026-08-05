import React from 'react';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveIntelligenceOutput } from '../../../core/intelligence/contracts/ExecutiveIntelligenceOutput';

export type BalanceSheetWorkingCapitalSectionProps = {
  bpSummary: any;
  diagnostics: ExecutiveIntelligenceOutput | null;
};

export const BalanceSheetWorkingCapitalSection = ({ bpSummary, diagnostics }: BalanceSheetWorkingCapitalSectionProps) => {
  if (!bpSummary || !diagnostics) return null;

  const fleuriet = diagnostics.evidence?.fleuriet;
  if (!fleuriet) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'text-success';
      case 'MEDIUM': return 'text-warning';
      case 'HIGH': return 'text-critical';
      case 'CRITICAL': return 'text-critical font-bold';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Working Capital Intelligence (Modelo Fleuriet)</ExecutiveHeading>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
          <ExecutiveText as="span" variant="label" className="text-secondary mb-1">Classificação</ExecutiveText>
          <ExecutiveText as="span" variant="bodyLarge" className={`font-semibold ${getRiskColor(fleuriet.riskLevel)}`}>
            {fleuriet.classification} ({fleuriet.type})
          </ExecutiveText>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
          <ExecutiveText as="span" variant="label" className="text-secondary mb-1">Capital de Giro Líquido</ExecutiveText>
          <ExecutiveText as="span" variant="bodyLarge" className="font-semibold text-foreground">
            {fleuriet.cgl > 0 ? 'Positivo (+)' : fleuriet.cgl < 0 ? 'Negativo (-)' : 'Neutro'}
          </ExecutiveText>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
          <ExecutiveText as="span" variant="label" className="text-secondary mb-1">Necessidade de Giro</ExecutiveText>
          <ExecutiveText as="span" variant="bodyLarge" className="font-semibold text-foreground">
             {fleuriet.ncg > 0 ? 'Positivo (+)' : fleuriet.ncg < 0 ? 'Negativo (-)' : 'Neutro'}
          </ExecutiveText>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-border flex flex-col items-center justify-center text-center">
          <ExecutiveText as="span" variant="label" className="text-secondary mb-1">Saldo de Tesouraria</ExecutiveText>
          <ExecutiveText as="span" variant="bodyLarge" className="font-semibold text-foreground">
             {fleuriet.treasury > 0 ? 'Positivo (+)' : fleuriet.treasury < 0 ? 'Negativo (-)' : 'Neutro'}
          </ExecutiveText>
        </div>
      </div>

      <div className="bg-surface-container/30 p-4 mt-6 rounded-xl border border-border/50">
        <ExecutiveText as="p" variant="bodyStandard" className="text-primary italic">
          "{fleuriet.description}"
        </ExecutiveText>
      </div>
    </div>
  );
};
