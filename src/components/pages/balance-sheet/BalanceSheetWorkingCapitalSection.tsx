import React from 'react';
import { BalanceSheetIndicator } from './types';

export type BalanceSheetWorkingCapitalSectionProps = {
  indicators?: BalanceSheetIndicator[];
};

export const BalanceSheetWorkingCapitalSection = ({ indicators }: BalanceSheetWorkingCapitalSectionProps) => {
  return (
    <div className="bg-card rounded-[40px] p-10 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-border relative overflow-hidden">
      <h3 className="text-2xl font-black text-primary mb-6">Inteligência de Capital de Giro</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['Alocação de Capital de Giro', 'Ciclo Financeiro (Estimativa Indireta)'].map((metric, idx) => {
          const ind = indicators?.find((i) => i.metricName === metric);
          if (!ind) return null;
          return (
            <div key={idx} className="bg-surface-container/30 border border-border rounded-2xl p-6 shadow-sm">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-2">{metric}</h4>
              <span className="text-2xl font-black text-primary mb-2 block">
                {ind.format === 'percentage' ? (Number(ind.value)*100).toFixed(1)+'%' : ind.format === 'multiplier' ? Number(ind.value).toFixed(2)+'x' : ind.format === 'decimal' ? Number(ind.value).toFixed(1) : ind.value}
              </span>
              <p className="text-secondary">{ind.rationale}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
