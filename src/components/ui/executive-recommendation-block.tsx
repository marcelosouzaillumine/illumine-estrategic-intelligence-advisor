import React from 'react';
import { cn } from '../../lib/utils';

export interface ExecutiveRecommendationBlockProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function ExecutiveRecommendationBlock({
  title = "Recomendação Executiva",
  children,
  className
}: ExecutiveRecommendationBlockProps) {
  return (
    <div className={cn("mt-6 pt-5 border-t border-border/40 w-full flex flex-col items-start justify-start", className)}>
      {title && (
        <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          {title}
        </h4>
      )}
      <div className="text-[16px] font-normal leading-[1.75] text-executive-secondary max-w-[78ch]">
        {children}
      </div>
    </div>
  );
}
