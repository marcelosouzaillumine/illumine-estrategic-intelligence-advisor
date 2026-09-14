import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveText, ExecutiveMetric } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveLocalizationRegistry } from '@/core/i18n/executive-localization-registry';

export interface ExecutiveTechnicalMetricCardProps {
  label: string;
  value: React.ReactNode;
  statusLabel?: string;
  statusTone?: 'neutral' | 'success' | 'warning' | 'critical';
  /** @deprecated use confidenceLabel or confidenceValue instead */
  confidence?: string | number;
  confidenceLabel?: string;
  confidenceValue?: number;
  description?: React.ReactNode;
  className?: string;
}

export function ExecutiveTechnicalMetricCard({
  label,
  value,
  statusLabel,
  statusTone = 'neutral',
  confidence,
  confidenceLabel,
  confidenceValue,
  description,
  className
}: ExecutiveTechnicalMetricCardProps) {

  // Resolve confidence
  let finalConfidenceLabel: React.ReactNode = confidenceLabel;
  if (!finalConfidenceLabel && confidenceValue !== undefined) {
    finalConfidenceLabel = ExecutiveLocalizationRegistry.formatConfidence(confidenceValue, 'pt-BR');
  } else if (!finalConfidenceLabel && confidence !== undefined) {
    // Deprecated fallback
    finalConfidenceLabel = typeof confidence === 'number' 
      ? ExecutiveLocalizationRegistry.formatConfidence(confidence, 'pt-BR') 
      : confidence;
  }

  const showConfidence = !!finalConfidenceLabel;

  return (
    <ExecutiveSurface 
      padding="none" 
      variant="default"
      elevation="none"
      className={cn(
        "flex flex-col justify-start items-stretch w-full h-full p-4 rounded-2xl border border-border bg-surface-container/30",
        className
      )}
    >
      {/* Header Zone: Fixed minimum height guarantees value baseline alignment */}
      <div className={cn("w-full flex items-start justify-between min-h-[40px] gap-2 mb-2")} // @allow-margin
      >
        <div className="flex items-start gap-1.5 min-w-0">
          <ExecutiveText variant="metricLabel" as="div" className="line-clamp-2 break-words text-left">
            {label}
          </ExecutiveText>
        </div>
        {statusLabel && (
          <div className="shrink-0 flex items-start justify-end max-w-[50%]">
            <ExecutiveBadge variant={statusTone}>
              {statusLabel}
            </ExecutiveBadge>
          </div>
        )}
      </div>

      {/* Value Row Zone: Fixed minimum height to accommodate secondary values without breaking divider baseline */}
      <div className="w-full flex items-end justify-between min-h-[44px] mb-2" // @allow-margin
      >
        <ExecutiveMetric variant="metricCompact" as="div" className="text-left shrink-0 max-w-[65%] truncate">
          {value}
        </ExecutiveMetric>
        
        {showConfidence && (
          <div className="shrink-0 flex items-center justify-end pl-2 pb-1" // @allow-margin
          >
            <ExecutiveMetric variant="metricConfidence" as="span">
              {finalConfidenceLabel}
            </ExecutiveMetric>
          </div>
        )}
      </div>

      {/* Divider & Description Zone */}
      {description && (
        <div className="w-full flex flex-col flex-1 justify-start mt-1" // @allow-margin
        >
          <div className="w-full h-px mb-3 shrink-0 bg-border" // @allow-margin
          />
          <div className="w-full flex-1 flex flex-col items-start justify-start">
            <ExecutiveText variant="metricDescription" as="div" className="line-clamp-2 text-left">
              {description}
            </ExecutiveText>
          </div>
        </div>
      )}
    </ExecutiveSurface>
  );
}
