import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveText, ExecutiveSpacingRegistry } from '../../../../components/ui/executive-typography';

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
        "flex flex-col items-start justify-start h-full rounded-[24px] shadow-sm",
        ExecutiveSpacingRegistry.cardPaddingCompact,
        className
      )}
    >
      <div className={cn("flex items-center", ExecutiveSpacingRegistry.elementGap, "mb-3")}>
          <div className={cn("flex items-center justify-center shrink-0 w-10 h-10 rounded-full border border-border/50", bgClasses[tone], toneClasses[tone])}>
            {React.isValidElement(icon) ? icon : (typeof icon === 'function' || typeof icon === 'object' ? React.createElement(icon as any, { size: 20 }) : null)}
          </div>
        <ExecutiveText variant="caption" as="span">
          {label}
        </ExecutiveText>
      </div>
      <ExecutiveText variant="cardTitle" as="div">
        {value}
      </ExecutiveText>
    </ExecutiveSurface>
  );
}
