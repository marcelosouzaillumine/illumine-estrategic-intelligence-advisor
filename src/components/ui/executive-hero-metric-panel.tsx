import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveText, ExecutiveMetric, ExecutiveSpacingRegistry } from './executive-typography';
import { ExecutiveBadgeVariant } from './executive-badge';
import { ExecutiveSummaryDensity } from './executive-summary-card';

export interface ExecutiveHeroMetricPanelProps {
  title: string;
  value: number | string | null;
  statusBadge?: React.ReactNode;
  confidenceLabel?: string;
  density?: ExecutiveSummaryDensity;
  className?: string;
}

export const ExecutiveHeroRhythm = {
  badgeToScore: "mt-6", // 24px
  scoreLabelToValue: "gap-2", // 8px
  scoreToConfidence: "mt-3", // 12px (Visually ~20px due to text line-height)
  confidenceLabelToValue: "gap-0.5", // 2px
};

export function ExecutiveHeroMetricPanel({
  title,
  value,
  statusBadge,
  confidenceLabel,
  density = 'compact',
  className
}: ExecutiveHeroMetricPanelProps) {
  
  return (
    <div className={cn("flex flex-col items-start w-full gap-0", className)}>
      {/* 1. Status Line */}
      {statusBadge && (
        <div className="w-full flex justify-start">
          {statusBadge}
        </div>
      )}

      {/* 2. Score Group */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveHeroRhythm.badgeToScore, ExecutiveHeroRhythm.scoreLabelToValue)}>
        <ExecutiveText variant="label" className="whitespace-nowrap w-full truncate text-left">
          {title}
        </ExecutiveText>
        <ExecutiveMetric variant="heroMetric" as="div" className="text-left w-full truncate">
          {value === null || Number.isNaN(value) || value === undefined ? '—' : value}
        </ExecutiveMetric>
      </div>

      {/* 3. Confidence Group */}
      {confidenceLabel && (
        <div className={cn("flex flex-col items-start w-full", ExecutiveHeroRhythm.scoreToConfidence, ExecutiveHeroRhythm.confidenceLabelToValue)}>
          <ExecutiveText variant="label" className="whitespace-nowrap w-full truncate text-left">
            Confiança
          </ExecutiveText>
          <ExecutiveMetric variant="metricConfidence" as="div" className="text-left w-full truncate">
            {confidenceLabel}
          </ExecutiveMetric>
        </div>
      )}
    </div>
  );
}
