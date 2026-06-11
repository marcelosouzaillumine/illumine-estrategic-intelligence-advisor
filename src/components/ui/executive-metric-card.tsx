import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveMetricCardProps {
  label: string;
  value: React.ReactNode;
  description?: React.ReactNode;
  statusBadge?: React.ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
  variant?: 'default' | 'transparent';
  className?: string;
}

export function ExecutiveMetricCard({
  label,
  value,
  description,
  statusBadge,
  tone = 'neutral',
  variant = 'default',
  className
}: ExecutiveMetricCardProps) {
  // Determine border/subtle accents based on tone
  const toneClasses = {
    neutral: 'border-border',
    success: 'border-success/30 hover:border-success/50',
    warning: 'border-warning/30 hover:border-warning/50',
    critical: 'border-critical/30 hover:border-critical/50',
    info: 'border-info/30 hover:border-info/50',
  }[tone];

  return (
    <ExecutiveSurface 
      padding="none" 
      variant={variant}
      className={cn(
        "flex flex-col items-start justify-start w-full p-6 rounded-[24px] shadow-sm transition-all h-full",
        toneClasses,
        className
      )}
    >
      {/* Header Zone */}
      <div className="w-full flex items-start justify-between min-h-[48px] gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">
          {label}
        </span>
        {statusBadge && (
          <div className="shrink-0 flex items-start">
            {statusBadge}
          </div>
        )}
      </div>

      {/* Value Zone */}
      <div className="w-full flex flex-col items-start justify-start min-h-[64px] mb-2">
        <div className="text-xl md:text-2xl font-bold text-foreground leading-tight">
          {value}
        </div>
      </div>

      {/* Separator & Narrative Zone */}
      {description && (
        <>
          <div className="w-full h-px bg-border/50 my-4" />
          <div className="w-full flex-1 flex flex-col items-start justify-start text-sm text-foreground/75 leading-relaxed">
            {description}
          </div>
        </>
      )}
    </ExecutiveSurface>
  );
}
