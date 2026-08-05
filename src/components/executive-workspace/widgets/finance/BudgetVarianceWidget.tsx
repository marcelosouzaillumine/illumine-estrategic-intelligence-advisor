import React from 'react';
import { Target, TrendingDown, TrendingUp } from 'lucide-react';
import { useExecutiveFormatter } from '../../../../core/localization';

export interface BudgetVarianceWidgetProps {
  varianceValue: number;
  variancePercentage: number;
}

export function BudgetVarianceWidget({ varianceValue, variancePercentage }: BudgetVarianceWidgetProps) {
  const formatter = useExecutiveFormatter();
  const formatCurrency = (val: number) => {
    return formatter.currency(Math.abs(val));
  };

  const isPositive = variancePercentage >= 0;

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-full flex flex-col justify-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Desvio Orçamentário</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold text-foreground">
          {varianceValue < 0 ? '-' : '+'}{formatCurrency(varianceValue)}
        </span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-sm">
        {isPositive ? <TrendingUp size={16} className="text-emerald-500" /> : <TrendingDown size={16} className="text-rose-500" />}
        <span className={isPositive ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
          {Math.abs(variancePercentage)}% vs planejado
        </span>
      </div>
    </div>
  );
}
