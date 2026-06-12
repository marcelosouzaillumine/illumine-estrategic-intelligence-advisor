import React from 'react';
import { BalanceSheetIndicatorViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

export type BalanceSheetAssetQualitySectionProps = {
  indicators: BalanceSheetIndicatorViewModel[];
};

export const BalanceSheetAssetQualitySection = ({ indicators }: BalanceSheetAssetQualitySectionProps) => {
  return (
    <ExecutiveSurface 
      variant="default" 
      elevation="lg" 
      padding="none" 
      className="rounded-[40px] p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
    >
      <h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Qualidade do Ativo</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicators.map((ind, idx) => (
          <ExecutiveMetricCard
            key={idx}
            label={ind.label}
            value={ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : Number(ind.value).toFixed(2)}
            variant="transparent"
            className="bg-surface-container/30"
          />
        ))}
      </div>
    </ExecutiveSurface>
  );
};
