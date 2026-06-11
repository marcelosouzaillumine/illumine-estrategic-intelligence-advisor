import React from 'react';
import { ExecutiveInsightCard } from '../../ui/executive-insight-card';
import { ExecutiveNarrative } from '../../ui/executive-narrative';

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
  return (
    <div className="flex flex-col gap-6 mb-12">
      <ExecutiveInsightCard
        badge="Tese Patrimonial"
        headline={patrimonialHealth || 'Estrutura patrimonial em avaliação.'}
      />

      {hasParecer && (
        <div className="px-2 md:px-4 mt-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/50 mb-4">Parecer do Conselho</h4>
          <ExecutiveNarrative>
            {boardAdvisoryFullText ? (
              <div className="space-y-4">
                {boardAdvisoryFullText.includes('Recomendação:') ? (
                  <>
                    <p>{boardAdvisoryFullText.split('Recomendação:')[0].trim()}</p>
                    <p><strong className="font-medium text-foreground">Recomendação:</strong> {boardAdvisoryFullText.split('Recomendação:')[1].trim()}</p>
                  </>
                ) : (
                  <p>{boardAdvisoryFullText}</p>
                )}
              </div>
            ) : (
              <p className="text-foreground/60">Parecer não gerado.</p>
            )}
          </ExecutiveNarrative>
        </div>
      )}
    </div>
  );
};
