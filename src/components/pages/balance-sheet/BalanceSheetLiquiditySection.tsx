import React from 'react';
import { BalanceSheetIndicator } from './types';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

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
      <h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Liquidez e Solvência</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Liquidez Real', 'Liquidez Instantânea Real', 'Liquidez Seca'].map((metric, idx) => {
          const ind = indicators?.find((i) => i.metricName === metric);
          if (!ind) return null;
          return (
            <ExecutiveMetricCard
              key={idx}
              label={metric}
              value={Number(ind.value).toFixed(2)}
              variant="transparent"
              className="bg-surface-container/30"
            />
          );
        })}
      </div>
    </ExecutiveSurface>
  );
};
