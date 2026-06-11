import React from 'react';
import { BalanceSheetIndicatorViewModel } from './view-models';

export type BalanceSheetAssetQualitySectionProps = {
  indicators: BalanceSheetIndicatorViewModel[];
};

export const BalanceSheetAssetQualitySection = ({ indicators }: BalanceSheetAssetQualitySectionProps) => {
  return (
    <div className="bg-card rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border relative overflow-hidden">
      <h3 className="text-2xl font-black text-primary mb-6">Qualidade do Ativo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicators.map((ind, idx) => (
          <div key={idx} className="bg-surface-container/30 border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-foreground mb-2">{ind.label}</h4>
            <span className="text-3xl font-bold text-foreground mb-2 block">
              {ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : Number(ind.value).toFixed(2)}
            </span>
            <p className="text-foreground/70">{ind.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
