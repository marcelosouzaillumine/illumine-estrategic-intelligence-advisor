import React from 'react';
import { ExecutiveSurface } from './executive-surface';
import { cn } from '@/lib/utils';

export interface ExecutiveExposureCardProps {
  title: string;
  subtitle?: string;
  metrics: Array<{
    label: string;
    percentage: number;
    colorClass: string;
  }>;
  className?: string;
}

export function ExecutiveExposureCard({ title, subtitle, metrics, className }: ExecutiveExposureCardProps) {
  return (
    <ExecutiveSurface 
      padding="none" 
      className={cn("flex flex-col p-5 w-full h-full bg-card border-border/60", className)}
    >
      <div className="flex flex-col mb-5 pb-4 border-b border-border/40 shrink-0">
        <h3 className="text-[18px] font-semibold text-foreground tracking-tight leading-none">{title}</h3>
        {subtitle && (
          <p className="text-[13px] text-foreground/65 mt-1.5">{subtitle}</p>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-center gap-5 mt-1">
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/80">{metric.label}</span>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-surface-container/50 rounded-full overflow-hidden flex">
                <div className={cn("h-full transition-all duration-700 ease-out", metric.colorClass)} style={{ width: `${Math.min(100, Math.max(0, metric.percentage))}%` }} />
              </div>
              <span className="w-[42px] text-right text-[13px] font-bold text-foreground tabular-nums">{metric.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}
