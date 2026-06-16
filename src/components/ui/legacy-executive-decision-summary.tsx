import React from 'react';
import { cn } from '../../lib/utils';

export interface ExecutiveDecisionSummaryProps {
  label?: string;
  severityLabel: string;
  severityTone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  theme: string;
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

export function ExecutiveDecisionSummary({
  label = "Prioridade Estratégica",
  severityLabel,
  severityTone = 'neutral',
  theme,
  reasonLabel = "Motivo Principal",
  reason,
  className
}: ExecutiveDecisionSummaryProps) {
  return (
    <div className={cn("flex flex-col lg:flex-row lg:items-start lg:justify-between w-full border-l-2 border-border/50 pl-5 lg:pl-6 gap-6 lg:gap-12", className)}>
      <div className="flex flex-col items-start justify-start flex-1 min-w-0">
        {label && (
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/50 mb-3">
            {label}
          </h4>
        )}
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("inline-flex items-center h-6 px-2.5 rounded text-[10px] font-semibold uppercase tracking-[0.06em] border shrink-0", toneMap[severityTone])}>
            {severityLabel}
          </span>
          <span className="text-[18px] lg:text-[20px] font-semibold text-foreground leading-tight">
            {theme}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col items-start lg:items-end justify-start lg:text-right shrink-0">
        {reasonLabel && (
          <h4 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/50 mb-3">
            {reasonLabel}
          </h4>
        )}
        <div className="text-[14px] leading-relaxed font-medium text-foreground/75 flex items-center min-h-[24px]">
          {reason}
        </div>
      </div>
    </div>
  );
}
