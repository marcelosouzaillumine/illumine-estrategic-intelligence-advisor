import React from 'react';
import { BalanceSheetIndicator } from './types';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type BalanceSheetWorkingCapitalSectionProps = {
  indicators?: BalanceSheetIndicator[];
};

export const BalanceSheetWorkingCapitalSection = ({ indicators }: BalanceSheetWorkingCapitalSectionProps) => {
  return (
    <ExecutiveSurface 
      variant="default" 
      elevation="lg" 
      padding="none" 
      className="rounded-[40px] p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
    >
      <h3 className="text-2xl font-black text-primary mb-6">Inteligência de Capital de Giro</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Alocação de Capital de Giro', 'Ciclo Financeiro (Estimativa Indireta)'].map((metric, idx) => {
          const ind = indicators?.find((i) => i.metricName === metric);
          if (!ind) return null;
          return (
            <ExecutiveSurface 
              key={idx} 
              variant="transparent" 
              elevation="sm" 
              padding="none" 
              className="bg-surface-container/30 border border-border rounded-2xl p-6 flex flex-col items-start justify-start"
            >
              <div>
                <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground mb-3 opacity-90">{metric}</h4>
                <span className="text-2xl font-bold text-foreground block">
                  {ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : ind.format === 'decimal' ? Number(ind.value).toFixed(1) : ind.value}
                </span>
              </div>
              <div className="mt-5 pt-4 border-t border-border/50">
                <p className="text-foreground/70 text-xs leading-relaxed">{ind.rationale}</p>
              </div>
            </ExecutiveSurface>
          );
        })}
      </div>
    </ExecutiveSurface>
  );
};
