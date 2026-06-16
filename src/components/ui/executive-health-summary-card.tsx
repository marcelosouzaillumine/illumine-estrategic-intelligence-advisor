import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveAssessmentResult } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveStatusBadge, ExecutiveStatus } from './executive-status-badge';
import { ExecutiveMetric, ExecutiveText, ExecutiveSpacingRegistry } from './executive-typography';

export interface ExecutiveHealthSummaryCardProps {
  assessment: ExecutiveAssessmentResult;
  className?: string;
}

export function ExecutiveHealthSummaryCard({ assessment, className }: ExecutiveHealthSummaryCardProps) {
  const isExcellent = assessment.healthStatus === 'EXCELLENT';
  const isHealthy = assessment.healthStatus === 'HEALTHY';
  const isWarning = assessment.healthStatus === 'WARNING';
  const isCritical = assessment.healthStatus === 'CRITICAL';
  const isInsufficient = assessment.healthStatus === 'INSUFFICIENT_DATA';

  const status: ExecutiveStatus = isExcellent ? 'EXCELLENT' :
                                  isHealthy ? 'HEALTHY' :
                                  isWarning ? 'WARNING' :
                                  isCritical ? 'CRITICAL' :
                                  isInsufficient ? 'INSUFFICIENT_DATA' : 'NEUTRAL';

  return (
    <div className={cn(
      "w-full rounded-2xl border bg-white shadow-sm overflow-hidden flex flex-col md:flex-row items-stretch",
      isExcellent && "border-state-excellent-border",
      isHealthy && "border-state-healthy-border",
      isWarning && "border-state-warning-border",
      isCritical && "border-state-critical-border",
      isInsufficient && "border-border/30",
      className
    )}>
      {/* Badge & Score Section */}
      <div className={cn(
        "flex flex-col items-center md:items-start justify-center",
        ExecutiveSpacingRegistry.cardPadding,
        "md:w-[35%] lg:w-[25%] shrink-0 border-b md:border-b-0 md:border-r border-border",
        isExcellent && "bg-state-excellent-soft",
        isHealthy && "bg-state-healthy-soft",
        isWarning && "bg-state-warning-soft",
        isCritical && "bg-state-critical-soft",
        isInsufficient && "bg-state-insufficient-soft"
      )}>
        <div className={cn("flex flex-col items-center md:items-start", ExecutiveSpacingRegistry.contentGap, "w-full")}>
          <ExecutiveStatusBadge status={status} />
          
          <div className={cn("flex flex-col items-center md:items-start", ExecutiveSpacingRegistry.microGap)}>
            <ExecutiveText variant="label">Score Executivo</ExecutiveText>
            <ExecutiveMetric variant="heroMetric" as="span">
              {assessment.score === null || isInsufficient || Number.isNaN(assessment.score) || assessment.score === undefined ? '—' : assessment.score}
            </ExecutiveMetric>
          </div>

          {assessment.confidence && !isInsufficient && (
            <div className={cn("flex flex-col items-center md:items-start", ExecutiveSpacingRegistry.microGap)}>
              <ExecutiveText variant="label">Confiança</ExecutiveText>
              <ExecutiveMetric variant="metricMetaValue" as="span">
                {assessment.confidence}
              </ExecutiveMetric>
            </div>
          )}
        </div>
      </div>

      {/* Driver & Justification Section */}
      <div className={cn("flex-1 flex flex-col justify-center", ExecutiveSpacingRegistry.cardPadding, ExecutiveSpacingRegistry.contentGap)}>
        <div className={cn("flex flex-col", ExecutiveSpacingRegistry.elementGap)}>
          <ExecutiveText variant="label">Driver Principal</ExecutiveText>
          <ExecutiveText variant="cardTitle" as="h4">
            {assessment.primaryDriver}
          </ExecutiveText>
        </div>
        
        <ExecutiveText variant="body" as="p">
          {assessment.justification}
        </ExecutiveText>
      </div>
    </div>
  );
}
