import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveText, ExecutiveMetric } from '../../../../components/ui/executive-typography';

export interface ExecutiveTechnicalScoreProps {
  score: number | string | null;
  confidence?: string;
  className?: string;
}

export function ExecutiveTechnicalScore({
  score,
  confidence,
  className
}: ExecutiveTechnicalScoreProps) {
  if (score === null || Number.isNaN(score) || score === undefined) return null;

  return (
    <div className={cn("flex flex-col items-start gap-1 p-3 bg-surface-container/20 rounded-md border border-border/40", className)}>
      <div className="flex items-center gap-2">
        <ExecutiveText variant="microLabel" className="text-executive-muted">
          Índice Técnico
        </ExecutiveText>
        <ExecutiveMetric variant="metricValue" className="text-[18px] md:text-[20px] font-bold text-executive-primary">
          {score}
        </ExecutiveMetric>
        <ExecutiveText variant="caption" className="text-executive-muted">
          / 100
        </ExecutiveText>
      </div>
      
      {confidence && (
        <div className="flex items-center gap-1.5">
          <ExecutiveText variant="microLabel" className="text-executive-muted">
            Confiança:
          </ExecutiveText>
          <ExecutiveText variant="caption" className="text-executive-primary font-medium">
            {confidence}
          </ExecutiveText>
        </div>
      )}
    </div>
  );
}
