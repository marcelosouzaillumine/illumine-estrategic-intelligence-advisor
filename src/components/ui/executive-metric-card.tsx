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

  const badgeRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && badgeRef.current) {
      const text = badgeRef.current.textContent?.toUpperCase() || '';
      if ((text.includes('CRÍTICO') || text.includes('CRÍTICA') || text.includes('CRITICO') || text.includes('CRITICAL')) && tone !== 'critical') {
        console.warn(`[ExecutiveMetricCard] Semantic mismatch detected: Badge text implies critical severity ("${text}") but tone is "${tone}". Label: ${label}`);
      }
    }
  }, [tone, label, statusBadge]);

  return (
    <ExecutiveSurface 
      padding="none" 
      variant={variant}
      className={cn(
        "flex flex-col items-start justify-start w-full p-3 md:p-4 rounded-[24px] shadow-sm transition-all h-full",
        toneClasses,
        className
      )}
    >
      {/* Header Zone: Fixed minimum height guarantees value baseline alignment */}
      <div className="w-full flex items-start justify-between min-h-[32px] gap-2 mb-2">
        <span className="text-[11px] font-medium tracking-wide text-foreground/65 leading-snug line-clamp-2">
          {label}
        </span>
        {statusBadge && (
          <div ref={badgeRef} className="shrink-0 flex items-start">
            {statusBadge}
          </div>
        )}
      </div>

      {/* Value Zone: Fixed minimum height to accommodate secondary values without breaking divider baseline */}
      <div className="w-full flex flex-col items-start justify-start min-h-[44px] mb-2">
        <div className="text-[28px] font-semibold text-foreground leading-none w-full">
          {value}
        </div>
      </div>

      {/* Separator & Narrative Zone */}
      {description && (
        <div className="w-full flex flex-col flex-1 justify-start">
          <div className="w-full h-px bg-border/50 mb-2 shrink-0" />
          <div className="w-full flex-1 flex flex-col items-start justify-start text-[12px] leading-5 text-foreground/75">
            {description}
          </div>
        </div>
      )}
    </ExecutiveSurface>
  );
}
