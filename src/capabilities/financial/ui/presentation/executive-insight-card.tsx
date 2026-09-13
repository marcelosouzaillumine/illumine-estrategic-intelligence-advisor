import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveText, ExecutiveSpacingRegistry } from '../../../../components/ui/executive-typography';

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
        "flex flex-col items-start justify-start w-full rounded-[32px] shadow-sm",
        ExecutiveSpacingRegistry.cardPadding,
        className
      )}
    >
      {badge && (
        <div className={cn("inline-flex items-center h-7 px-3 bg-surface-container border border-border rounded-full", ExecutiveSpacingRegistry.elementGap, "mb-4")}>
          <ExecutiveText variant="caption" className="uppercase">
            {badge}
          </ExecutiveText>
        </div>
      )}
      <ExecutiveText variant="cardTitle" as="div" className="mb-4">
        {headline}
      </ExecutiveText>
      {content && (
        <ExecutiveText variant="body" as="div" className="max-w-[82ch]">
          {content}
        </ExecutiveText>
      )}
    </ExecutiveSurface>
  );
}
