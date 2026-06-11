import React from 'react';
import { cn } from '../../lib/utils';

export interface ExecutiveActionSummaryProps {
  label?: string;
  severityLabel: string;
  severityTone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  directive: string;
  reasonLabel?: string;
  reason: React.ReactNode;
  className?: string;
}

const toneMap = {
  neutral: "bg-surface-container text-foreground/70 border-border",
  success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  critical: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  info: "bg-sky-500/10 text-sky-600 border-sky-500/20",
};

export function ExecutiveActionSummary({
  label = "Prioridade Estratégica",
  severityLabel,
  severityTone = 'neutral',
  directive,
  reasonLabel = "Motivo Principal",
  reason,
  className
}: ExecutiveActionSummaryProps) {
  return (
    <div className={cn("flex flex-col lg:flex-row lg:items-start lg:justify-between w-full border-l-2 border-border/50 pl-5 lg:pl-6 gap-6", className)}>
      <div className="flex flex-col items-start justify-start max-w-2xl">
        {label && (
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/50 mb-3">
            {label}
          </h4>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("inline-flex items-center h-6 px-2.5 rounded text-[10px] font-semibold uppercase tracking-[0.06em] border", toneMap[severityTone])}>
            {severityLabel}
          </span>
          <span className="text-[18px] lg:text-[20px] font-semibold text-foreground leading-tight">
            {directive}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-start lg:items-end justify-start lg:text-right max-w-sm">
        {reasonLabel && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/50 mb-2">
            {reasonLabel}
          </span>
        )}
        <div className="text-[13px] leading-relaxed text-foreground/75">
          {reason}
        </div>
      </div>
    </div>
  );
}
