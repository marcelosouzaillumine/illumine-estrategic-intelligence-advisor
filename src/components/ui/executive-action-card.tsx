import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveActionCardProps {
  category: string;
  timeline: string;
  action: React.ReactNode;
  className?: string;
}

export function ExecutiveActionCard({
  category,
  timeline,
  action,
  className
}: ExecutiveActionCardProps) {
  return (
    <ExecutiveSurface
      padding="none"
      className={cn("flex flex-col items-start justify-start p-6 rounded-[24px] shadow-sm border border-border/50 h-full", className)}
    >
      <div className="w-full flex items-center justify-between mb-4">
        <h5 className="text-[10px] font-semibold uppercase tracking-[0.08em] text-foreground/60">{category}</h5>
        <span className="inline-flex items-center h-6 px-2.5 bg-surface-container border border-border/50 rounded text-[9px] font-semibold uppercase tracking-[0.06em] text-foreground/70">
          {timeline}
        </span>
      </div>
      <div className="text-[14px] leading-relaxed text-foreground/80">
        {action}
      </div>
    </ExecutiveSurface>
  );
}
