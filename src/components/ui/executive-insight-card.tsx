import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveInsightCardProps {
  badge?: string;
  headline: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
}

export function ExecutiveInsightCard({
  badge,
  headline,
  content,
  className
}: ExecutiveInsightCardProps) {
  return (
    <ExecutiveSurface
      padding="none"
      className={cn(
        "flex flex-col items-start justify-start p-8 md:p-12 w-full rounded-[32px] shadow-sm",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center h-7 px-3 bg-surface-container border border-border rounded-full text-[10px] md:text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70 mb-4">
          {badge}
        </span>
      )}
      <div className="text-[26px] md:text-[30px] lg:text-[32px] font-semibold leading-tight tracking-tight text-foreground mb-4">
        {headline}
      </div>
      {content && (
        <div className="text-[16px] leading-[1.75] text-foreground/75 max-w-[82ch]">
          {content}
        </div>
      )}
    </ExecutiveSurface>
  );
}
