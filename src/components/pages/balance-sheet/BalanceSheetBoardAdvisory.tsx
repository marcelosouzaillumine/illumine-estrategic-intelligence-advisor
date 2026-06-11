import React from 'react';
import { ExecutiveDecisionMemo } from '../../ui/executive-decision-memo';
import { Briefcase } from 'lucide-react';

export type BalanceSheetBoardAdvisoryProps = {
  hasParecer: boolean;
  patrimonialHealth?: string;
  boardAdvisoryFullText?: string;
};

export const BalanceSheetBoardAdvisory = ({ 
  hasParecer, 
  patrimonialHealth, 
  boardAdvisoryFullText 
}: BalanceSheetBoardAdvisoryProps) => {
  if (!hasParecer && !patrimonialHealth) return null;

  let narrative: React.ReactNode = <p className="text-foreground/60">Parecer não gerado.</p>;
  let recommendation: React.ReactNode = undefined;

  if (boardAdvisoryFullText) {
    if (boardAdvisoryFullText.includes('Recomendação:')) {
      const parts = boardAdvisoryFullText.split('Recomendação:');
      narrative = parts[0].trim();
      recommendation = parts[1].trim();
    } else {
      narrative = boardAdvisoryFullText;
    }
  }

  return (
    <div className="w-full mb-12">
      <ExecutiveDecisionMemo
        icon={<Briefcase />}
        title="Síntese Executiva para Tomada de Decisão"
        subtitle="Parecer analítico fiduciário para o Conselho"
        thesis={patrimonialHealth || 'Estrutura patrimonial em avaliação.'}
        narrative={narrative}
        recommendation={recommendation}
      />
    </div>
  );
};
