import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveTechnicalMetricCardProps {
  label: string;
  value: React.ReactNode;
  statusLabel?: string;
  statusTone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  confidence?: string | number;
  description?: React.ReactNode;
  className?: string;
}

export function ExecutiveTechnicalMetricCard({
  label,
  value,
  statusLabel,
  statusTone = 'neutral',
  confidence,
  description,
  className
}: ExecutiveTechnicalMetricCardProps) {
  const getBadgeClasses = (t: string) => {
    const base = "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border whitespace-nowrap font-bold";
    switch (t) {
      case 'critical': return cn(base, "bg-rose-100 text-rose-900 border-rose-300");
      case 'warning': return cn(base, "bg-amber-100 text-amber-900 border-amber-300");
      case 'success': return cn(base, "bg-emerald-100 text-emerald-900 border-emerald-300");
      case 'info': return cn(base, "bg-blue-100 text-blue-900 border-blue-300");
      default: return cn(base, "bg-surface-container/50 text-foreground/70 border-border");
    }
  };

  return (
    <ExecutiveSurface 
      padding="none" 
      variant="default"
      elevation="none"
      className={cn(
        "flex flex-col justify-start w-full h-full p-3 md:p-4 rounded-2xl border border-border bg-surface-container/30",
        className
      )}
    >
      <div className="w-full flex items-start justify-between gap-2 mb-2 min-h-[34px]">
        <span className="text-[11px] font-medium tracking-wide text-foreground/65 leading-snug line-clamp-2">
          {label}
        </span>
        {statusLabel && (
          <div className="shrink-0 flex items-start">
            <span className={getBadgeClasses(statusTone)}>{statusLabel}</span>
          </div>
        )}
      </div>

      <div className="w-full flex items-end justify-between pt-1">
        <div className="text-[26px] font-semibold text-foreground leading-none">
          {value}
        </div>
        
        {confidence !== undefined && (
          <div className="shrink-0 flex items-center justify-end pl-2">
            <span className="text-[11px] text-foreground/55 font-medium">
              Conf: {confidence}%
            </span>
          </div>
        )}
      </div>

      {description && (
        <div className="w-full mt-auto pt-3 border-t border-border/50">
          <p className="text-[11px] leading-relaxed text-foreground/70">
            {description}
          </p>
        </div>
      )}
    </ExecutiveSurface>
  );
}
