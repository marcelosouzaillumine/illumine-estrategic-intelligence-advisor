import React from 'react';
import { cn } from '@/lib/utils';

export interface ExecutiveStatProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
}

export function ExecutiveStat({ label, value, trend, className, ...props }: ExecutiveStatProps) {
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-success';
      case 'down': return 'text-critical';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-2xl tracking-tight text-foreground tabular-nums">{value}</span>
        {trend && (
          <span className={cn("text-xs font-semibold flex items-center gap-0.5", getTrendColor(trend.direction))}>
            {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
