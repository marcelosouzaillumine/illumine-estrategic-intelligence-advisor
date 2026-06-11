import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveRestrictionRowProps {
  label?: string;
  title: string;
  severity: "critical" | "warning" | "attention" | "info";
  status?: string;
  description?: string;
}

export function ExecutiveRestrictionRow({
  label,
  title,
  severity,
  status,
  description
}: ExecutiveRestrictionRowProps) {
  const getBadgeClasses = (s: string) => {
    const base = "text-[9px] uppercase tracking-widest px-2 py-0.5 rounded border whitespace-nowrap font-bold";
    switch (s) {
      case 'critical': return cn(base, "bg-rose-100 text-rose-900 border-rose-300");
      case 'warning': return cn(base, "bg-amber-100 text-amber-900 border-amber-300");
      case 'attention': return cn(base, "bg-amber-50 text-amber-700 border-amber-200");
      case 'info': return cn(base, "bg-blue-100 text-blue-900 border-blue-300");
      default: return cn(base, "bg-surface-container/50 text-foreground/70 border-border");
    }
  };

  return (
    <ExecutiveSurface 
      padding="none" 
      variant="default"
      elevation="none"
      className="flex flex-col p-4 bg-card border border-border/60 rounded-2xl w-full"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          {label && (
            <span className="text-[11px] font-medium tracking-wide text-foreground/65 leading-snug">
              {label}
            </span>
          )}
          <span className="text-[15px] font-semibold text-foreground leading-snug">
            {title}
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          {status && (
            <span className="text-[11px] font-medium text-foreground/50 uppercase tracking-wider">
              {status}
            </span>
          )}
          <span className={getBadgeClasses(severity)}>{severity === 'critical' ? 'CRÍTICO' : severity === 'warning' ? 'ALTA' : severity === 'attention' ? 'MÉDIA' : severity}</span>
        </div>
      </div>
      
      {description && (
        <div className="mt-3 pt-3 border-t border-border/50 text-[12px] leading-5 text-foreground/75">
          {description}
        </div>
      )}
    </ExecutiveSurface>
  );
}
