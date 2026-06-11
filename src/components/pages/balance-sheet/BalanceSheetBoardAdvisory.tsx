import React from 'react';
import { cn } from '../../../lib/utils';
import { ExecutiveSurface } from '../../ui/executive-surface';

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
    <div className="flex flex-col gap-6 mb-6">
      <ExecutiveSurface variant="transparent" padding="none" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-[40px] p-10 md:p-12 shadow-2xl hover:shadow-indigo-900/20 transition-all duration-500 relative overflow-hidden flex flex-col items-start justify-start border border-border">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-start justify-start">
          <span className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-[10px] font-semibold uppercase tracking-widest text-white mb-6 self-start">Tese Patrimonial</span>
          <h3 className="text-xl md:text-2xl font-bold mb-4 text-white max-w-4xl leading-relaxed">
            {patrimonialHealth || 'Estrutura patrimonial em avaliação.'}
          </h3>
        </div>
      </ExecutiveSurface>

      {hasParecer && (
      <ExecutiveSurface padding="none" className="rounded-[40px] p-10 md:p-12 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col items-start justify-start transition-all duration-500 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-surface-container/30 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 pointer-events-none" />
        <div className="relative z-10 w-full flex flex-col items-start justify-start">
        <span className="inline-block px-4 py-1.5 rounded-full border border-border bg-surface-container/30 text-[10px] font-semibold uppercase tracking-widest text-foreground/70 mb-6 self-start">Parecer do Conselho</span>
        {boardAdvisoryFullText ? (
          <div className="text-sm md:text-base font-semibold text-foreground/75 leading-relaxed space-y-4">
            {boardAdvisoryFullText.includes('Recomendação:') ? (
              <>
                <p>{boardAdvisoryFullText.split('Recomendação:')[0].trim()}</p>
                <p><strong className="font-bold text-foreground">Recomendação:</strong> {boardAdvisoryFullText.split('Recomendação:')[1].trim()}</p>
              </>
            ) : (
              <p>{boardAdvisoryFullText}</p>
            )}
          </div>
        ) : (
          <p className="text-foreground/70">Parecer não gerado.</p>
        )}
        </div>
      </ExecutiveSurface>
    )}
    </div>
  );
};
