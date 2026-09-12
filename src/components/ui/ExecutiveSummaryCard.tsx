import React from 'react';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';
import { cn } from '../../lib/utils';
import { TechnicalAssessment } from '../../../packages/shell/executive-intelligence-layer/src/contracts/TechnicalAssessment';

interface ExecutiveSummaryCardProps {
  assessment: TechnicalAssessment;
  className?: string;
}

export function ExecutiveSummaryCard({ assessment, className }: ExecutiveSummaryCardProps) {
  if (!assessment.executiveSummary || assessment.executiveSummary.length === 0) return null;

  return (
    <ExecutiveSurface className={cn("p-6", className)}>
      <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">
        Executive Summary
      </ExecutiveHeading>
      <ul className="space-y-3">
        {assessment.executiveSummary.slice(0, 5).map((bullet, idx) => (
          <li key={idx} className="flex gap-3 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-executive-primary mt-2 shrink-0" />
            <ExecutiveText variant="bodyStandard" className="text-foreground leading-relaxed">
              {bullet}
            </ExecutiveText>
          </li>
        ))}
      </ul>
    </ExecutiveSurface>
  );
}
