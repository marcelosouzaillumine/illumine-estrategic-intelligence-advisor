import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveInfoCardProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
  tone?: "default" | "success" | "warning" | "critical" | "info";
  className?: string;
}

export function ExecutiveInfoCard({
  icon,
  label,
  value,
  tone = "default",
  className
}: ExecutiveInfoCardProps) {
  const toneClasses = {
    default: "text-foreground",
    success: "text-success",
    warning: "text-warning",
    critical: "text-critical",
    info: "text-primary"
  };

  const bgClasses = {
    default: "bg-surface-container",
    success: "bg-success/10",
    warning: "bg-warning/10",
    critical: "bg-critical/10",
    info: "bg-primary/10"
  };

  return (
    <ExecutiveSurface
      padding="none"
      className={cn(
        "flex flex-col items-start justify-start p-5 h-full rounded-[24px] shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className={cn("flex items-center justify-center shrink-0 w-10 h-10 rounded-full border border-border/50", bgClasses[tone], toneClasses[tone])}>
            {icon}
          </div>
        )}
        <span className="text-[11px] font-medium tracking-wide text-foreground/65">
          {label}
        </span>
      </div>
      <div className="text-[18px] font-semibold leading-snug text-foreground">
        {value}
      </div>
    </ExecutiveSurface>
  );
}
