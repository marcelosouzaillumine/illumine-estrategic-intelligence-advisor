import React from 'react';
import { ExecutiveInsightCard } from '../../ui/executive-insight-card';
import { ExecutiveNarrative } from '../../ui/executive-narrative';
import { ExecutiveRecommendationBlock } from '../../ui/executive-recommendation-block';

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
    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-16 mb-12">
      <div className="w-full lg:w-[35%] shrink-0">
        <ExecutiveInsightCard
          badge="Tese Patrimonial"
          headline={patrimonialHealth || 'Estrutura patrimonial em avaliação.'}
        />
      </div>

      {hasParecer && (
        <div className="w-full lg:w-[65%] min-w-0 mt-2 lg:mt-0 pt-0 lg:pt-6">
          <ExecutiveNarrative variant="board-note" title="Parecer Institucional">
            {boardAdvisoryFullText ? (
              <div className="space-y-4">
                {boardAdvisoryFullText.includes('Recomendação:') ? (
                  <>
                    <p>{boardAdvisoryFullText.split('Recomendação:')[0].trim()}</p>
                    <ExecutiveRecommendationBlock>
                      {boardAdvisoryFullText.split('Recomendação:')[1].trim()}
                    </ExecutiveRecommendationBlock>
                  </>
                ) : (
                  <p>{boardAdvisoryFullText}</p>
                )}
              </div>
            ) : (
              <p className="text-executive-muted">Parecer não gerado.</p>
            )}
          </ExecutiveNarrative>
        </div>
      )}
    </div>
  );
};
