import React from 'react';
import { ExecutiveDecisionMemo } from '../../ui/executive-decision-memo';
import { MessageSquare } from 'lucide-react';

export type BalanceSheetExecutiveSynthesisSectionProps = {
  executiveNarrative?: string;
};

export const BalanceSheetExecutiveSynthesisSection = ({
  executiveNarrative
}: BalanceSheetExecutiveSynthesisSectionProps) => {
  if (!executiveNarrative) return null;

  let narrative: React.ReactNode = executiveNarrative;
  let recommendation: React.ReactNode = undefined;

  if (executiveNarrative.includes('Recomendação:')) {
    const parts = executiveNarrative.split('Recomendação:');
    narrative = parts[0].trim();
    recommendation = parts[1].trim();
  }

  return (
    <div className="w-full mt-12 mb-12">
      <ExecutiveDecisionMemo
        icon={<MessageSquare />}
        title="Síntese Executiva para Tomada de Decisão"
        subtitle="Parecer analítico fiduciário para o Conselho"
        narrative={narrative}
        recommendation={recommendation}
      />
    </div>
  );
};
