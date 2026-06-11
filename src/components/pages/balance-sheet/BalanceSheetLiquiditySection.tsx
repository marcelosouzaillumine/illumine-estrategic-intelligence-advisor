import React from 'react';
import { BalanceSheetIndicator } from './types';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type BalanceSheetLiquiditySectionProps = {
  indicators?: BalanceSheetIndicator[];
};

export const BalanceSheetLiquiditySection = ({ indicators }: BalanceSheetLiquiditySectionProps) => {
  return (
    <ExecutiveSurface 
      variant="default" 
      elevation="lg" 
      padding="none" 
      className="rounded-[40px] p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
    >
      <h3 className="text-2xl font-black text-primary mb-6">Liquidez e Solvência</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Liquidez Real', 'Liquidez Instantânea Real', 'Liquidez Seca'].map((metric, idx) => {
          const ind = indicators?.find((i) => i.metricName === metric);
          if (!ind) return null;
          return (
            <ExecutiveSurface 
              key={idx} 
              variant="transparent" 
              elevation="sm" 
              padding="none" 
              className="bg-surface-container/30 border border-border rounded-2xl p-6 flex flex-col justify-between"
            >
              <h4 className="text-[10px] font-semibold uppercase tracking-widest text-foreground mb-2">{metric}</h4>
              <span className="text-2xl font-bold text-foreground mb-2">{Number(ind.value).toFixed(2)}</span>
              <p className="text-foreground/70">{ind.rationale}</p>
            </ExecutiveSurface>
          );
        })}
      </div>
    </ExecutiveSurface>
  );
};
