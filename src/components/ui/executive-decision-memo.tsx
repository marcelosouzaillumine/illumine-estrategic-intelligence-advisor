import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveDecisionMemoProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  thesis?: React.ReactNode;
  narrative: React.ReactNode;
  recommendation?: React.ReactNode;
  metadata?: React.ReactNode;
  className?: string;
}

export function ExecutiveDecisionMemo({
  icon,
  title,
  subtitle,
  thesis,
  narrative,
  recommendation,
  metadata,
  className
}: ExecutiveDecisionMemoProps) {
  return (
    <ExecutiveSurface 
      padding="none" 
      radius="xl"
      className={cn("flex flex-col w-full overflow-hidden border border-border bg-card", className)}
    >
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="text-white/80 [&>svg]:w-9 [&>svg]:h-9 md:[&>svg]:w-11 md:[&>svg]:h-11 shrink-0">
              {React.isValidElement(icon) ? icon : (typeof icon === 'function' || typeof icon === 'object' ? React.createElement(icon as any, { size: 40 }) : null)}
            </div>
          )}
          <div className="flex flex-col">
            <h3 className="text-[22px] md:text-[26px] font-semibold tracking-wide text-white leading-tight">{title}</h3>
            {subtitle && (
              <span className="text-[11px] font-medium tracking-[0.14em] text-white/70 uppercase mt-1">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        {metadata && (
          <div className="shrink-0 text-white/80">
            {metadata}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 flex flex-col items-center w-full">
        <div className="max-w-[88ch] w-full flex flex-col gap-6">
          {thesis && (
            <h4 className="text-[18px] md:text-[20px] font-semibold text-foreground leading-snug">
              {thesis}
            </h4>
          )}
          
          <div className="text-[15px] md:text-[16px] leading-relaxed text-foreground/80 text-justify whitespace-pre-wrap">
            {narrative}
          </div>

          {recommendation && (
            <div className="mt-2 pt-6 border-t border-border/60 flex flex-col gap-2">
              <span className="text-[11px] font-semibold tracking-wide text-foreground/65 uppercase">
                Recomendação Executiva
              </span>
              <div className="text-[15px] leading-7 text-foreground/85">
                {recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </ExecutiveSurface>
  );
}
