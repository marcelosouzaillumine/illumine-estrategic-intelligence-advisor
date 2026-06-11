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

  // Enforce high-contrast semantic badges globally, safely overriding only text spans
  const getBadgeClasses = (t: string) => {
    const base = "text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border whitespace-nowrap font-semibold";
    switch (t) {
      case 'critical': return cn(base, "bg-rose-100 text-rose-900 border-rose-300");
      case 'warning': return cn(base, "bg-amber-100 text-amber-900 border-amber-300");
      case 'success': return cn(base, "bg-emerald-100 text-emerald-900 border-emerald-300");
      case 'info': return cn(base, "bg-blue-100 text-blue-900 border-blue-300");
      default: return cn(base, "bg-surface-container/50 text-foreground/70 border-border");
    }
  };

  const renderedBadge = React.isValidElement(statusBadge) && statusBadge.type === 'span'
    ? React.cloneElement(statusBadge as React.ReactElement<{ className?: string }>, {
        className: getBadgeClasses(tone)
      })
    : statusBadge;

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
        {renderedBadge && (
          <div ref={badgeRef} className="shrink-0 flex items-start">
            {renderedBadge}
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
          <div className="w-full flex-1 flex flex-col items-start justify-start text-[12px] leading-[1.55] text-foreground/75">
            {description}
          </div>
        </div>
      )}
    </ExecutiveSurface>
  );
}
