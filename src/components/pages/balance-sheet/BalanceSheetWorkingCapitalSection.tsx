import React from 'react';
import { BalanceSheetIndicator } from './types';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

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
      <h3 className="text-xl md:text-[22px] font-semibold text-foreground mb-6">Inteligência de Capital de Giro</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Alocação de Capital de Giro', 'Ciclo Financeiro (Estimativa Indireta)'].map((metric, idx) => {
          const ind = indicators?.find((i) => i.metricName === metric);
          if (!ind) return null;
          return (
            <ExecutiveMetricCard
              key={idx}
              label={metric}
              value={ind.value === 'INSUFFICIENT_DATA' ? 'Dados Insuficientes' : (ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : ind.format === 'decimal' ? Number(ind.value).toFixed(1) : ind.value)}
              description={ind.rationale}
              variant="transparent"
              className="bg-surface-container/30"
            />
          );
        })}
      </div>
    </ExecutiveSurface>
  );
};
