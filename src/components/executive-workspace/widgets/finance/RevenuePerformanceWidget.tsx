import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useExecutiveFormatter } from '../../../../core/localization';

export interface RevenuePerformanceWidgetProps {
  value: number;
  trend: 'up' | 'down' | 'neutral';
  percentageChange: number;
}

export function RevenuePerformanceWidget({ value, trend, percentageChange }: RevenuePerformanceWidgetProps) {
  const formatter = useExecutiveFormatter();
  const formatCurrency = (val: number) => {
    return formatter.currency(val);
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-full flex flex-col justify-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Receita Líquida</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold text-foreground">{formatCurrency(value)}</span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-sm">
        <TrendIcon size={16} className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-neutral-500'} />
        <span className={trend === 'up' ? 'text-emerald-500 font-medium' : trend === 'down' ? 'text-rose-500 font-medium' : 'text-neutral-500 font-medium'}>
          {percentageChange}% vs projetado
        </span>
      </div>
    </div>
  );
}
