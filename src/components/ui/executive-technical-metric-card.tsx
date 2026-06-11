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
        "flex flex-col justify-start items-stretch w-full h-full p-4 rounded-2xl border border-border bg-surface-container/30",
        className
      )}
    >
      {/* Header Zone */}
      <div 
        className="w-full grid items-start gap-[12px] min-h-[36px]" 
        style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}
      >
        <div className="min-w-0 pr-2">
          <span className="text-[11px] font-medium tracking-wide text-foreground/65 leading-4 line-clamp-2 break-words">
            {label}
          </span>
        </div>
        {statusLabel && (
          <div className="shrink-0 justify-self-end">
            <span 
              className={cn(getBadgeClasses(statusTone), "max-w-[140px] whitespace-normal break-words block text-center")}
              title={statusLabel}
            >
              {statusLabel === 'CONCENTRAÇÃO NO CURTO PRAZO' ? 'CURTO PRAZO' : statusLabel}
            </span>
          </div>
        )}
      </div>

      {/* Value Zone */}
      <div className="w-full flex items-end justify-between min-h-[48px]">
        <div className="text-[26px] font-semibold text-foreground leading-none">
          {value}
        </div>
        
        {confidence !== undefined && (
          <div className="shrink-0 flex items-center justify-end pl-2">
            <span className="text-[11px] text-foreground/55 font-medium mb-0.5">
              Conf: {confidence}%
            </span>
          </div>
        )}
      </div>

      {/* Divider Zone */}
      {description && (
        <div className="w-full my-2 border-t border-border/40" />
      )}

      {/* Description Zone */}
      {description && (
        <div className="w-full flex-1">
          <p className="text-[12px] leading-[1.55] text-foreground/75">
            {description}
          </p>
        </div>
      )}
    </ExecutiveSurface>
  );
}
