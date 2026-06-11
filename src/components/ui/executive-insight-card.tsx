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
        "flex flex-col items-start justify-start p-6 md:p-8 w-full rounded-[32px] shadow-sm",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center h-7 px-3 bg-surface-container border border-border rounded-full text-[10px] font-medium uppercase tracking-[0.06em] text-foreground/60 mb-4">
          {badge}
        </span>
      )}
      <div className="text-[28px] lg:text-[30px] font-semibold leading-[1.2] tracking-tight text-foreground mb-4">
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
