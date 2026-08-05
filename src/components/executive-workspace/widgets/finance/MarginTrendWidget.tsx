import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MarginTrendWidgetProps {
  currentMargin: number;
  trend: 'up' | 'down' | 'neutral';
  percentagePointsChange: number;
}

export function MarginTrendWidget({ currentMargin, trend, percentagePointsChange }: MarginTrendWidgetProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-full flex flex-col justify-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Tendência de Margem</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-2xl font-bold text-foreground">{currentMargin.toFixed(1)}%</span>
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-sm">
        <TrendIcon size={16} className={trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-neutral-500'} />
        <span className={trend === 'up' ? 'text-emerald-500 font-medium' : trend === 'down' ? 'text-rose-500 font-medium' : 'text-neutral-500 font-medium'}>
          {percentagePointsChange > 0 ? '+' : ''}{percentagePointsChange} pp vs proj
        </span>
      </div>
    </div>
  );
}
