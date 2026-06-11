import React from 'react';
import { BalanceSheetIndicatorViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

export type BalanceSheetCapitalStructureSectionProps = {
  indicators: BalanceSheetIndicatorViewModel[];
};

export const BalanceSheetCapitalStructureSection = ({ indicators }: BalanceSheetCapitalStructureSectionProps) => {
  return (
    <ExecutiveSurface 
      variant="default" 
      elevation="lg" 
      padding="none" 
      className="rounded-[40px] p-10 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
    >
      <h3 className="text-2xl font-bold text-foreground mb-6">Estrutura de Capital</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
        {indicators.map((ind, idx) => (
          <ExecutiveMetricCard
            key={idx}
            label={ind.label}
            value={ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : ind.format === 'decimal' ? Number(ind.value).toFixed(2) : ind.value}
            description={ind.rationale}
            variant="transparent"
            className="bg-surface-container/30"
          />
        ))}
      </div>
    </ExecutiveSurface>
  );
};
