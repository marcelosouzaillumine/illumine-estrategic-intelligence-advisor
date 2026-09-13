import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';

export interface ExecutiveRiskRowProps {
  title: string;
  severityTone: "critical" | "warning" | "success" | "info" | "neutral";
  severityLabel: string;
  consequence: string;
  action?: React.ReactNode;
  className?: string;
}

export function ExecutiveRiskRow({
  title,
  severityTone,
  severityLabel,
  consequence,
  action,
  className
}: ExecutiveRiskRowProps) {
  // Use canonical badge classes matching ExecutiveMetricCard v10.1C
  const getBadgeClasses = (t: string) => {
    const base = "text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full border whitespace-nowrap inline-flex items-center justify-center";
    switch (t) {
      case 'critical': return cn(base, "bg-rose-100 text-rose-900 border-rose-300");
      case 'warning': return cn(base, "bg-amber-100 text-amber-900 border-amber-300");
      case 'success': return cn(base, "bg-emerald-100 text-emerald-900 border-emerald-300");
      case 'info': return cn(base, "bg-blue-100 text-blue-900 border-blue-300");
      default: return cn(base, "bg-surface-container/50 text-muted-foreground border-border");
    }
  };

  return (
    <ExecutiveSurface 
      padding="none" 
      variant="default"
      className={cn(
        "w-full flex flex-col md:flex-row md:items-center justify-start gap-3 md:gap-4 py-3 md:py-3.5 px-4 md:px-5 transition-all group",
        "border-b border-border/30 last:border-0 rounded-none first:rounded-t-xl last:rounded-b-xl shadow-none",
        "hover:bg-surface-high/40",
        className
      )}
    >
      {/* 28% - Title */}
      <div className="w-full md:w-[28%] shrink-0 flex items-center">
        <span className="text-[15px] font-semibold leading-5 text-foreground">
          {title}
        </span>
      </div>
      
      {/* 14% - Badge */}
      <div className="w-full md:w-[14%] shrink-0 flex items-center justify-start">
        <span className={getBadgeClasses(severityTone)}>
          {severityLabel}
        </span>
      </div>

      {/* 48% - Consequence */}
      <div className="w-full md:w-[48%] flex items-center">
        <span className="text-[14px] font-normal leading-5 text-foreground/78">
          {consequence}
        </span>
      </div>

      {/* 10% - Action/Icon (Optional) */}
      <div className="w-full md:w-[10%] shrink-0 flex items-center justify-end">
        {action && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-muted-foreground hover:text-foreground">
            {action}
          </div>
        )}
      </div>
    </ExecutiveSurface>
  );
}
