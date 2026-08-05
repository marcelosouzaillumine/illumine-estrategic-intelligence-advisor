import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveBadge, ExecutiveBadgeVariant } from './executive-badge';
import { ExecutiveDecisionPanel } from './executive-decision-panel';
import { ExecutiveSpacingRegistry } from './executive-typography';
import { ExecutiveSurface } from './executive-surface';

export type ExecutiveSummaryDensity = 'comfortable' | 'compact' | 'analytical';

export interface ExecutiveSummaryMetric {
  title: string;
  value: string | number;
}

export interface ExecutiveSummarySectionProps {
  status: {
    label: string;
    variant: ExecutiveBadgeVariant;
  };
  question: string;
  opinion: string;
  driver: string;
  implication: string;
  executiveQuestion?: string;
  technicalScore?: {
    value: number | string | null;
    confidence?: string;
  };
  children?: React.ReactNode;
  className?: string;
}

export function ExecutiveSummarySection({ 
  status,
  question,
  opinion,
  driver,
  implication,
  executiveQuestion,
  technicalScore,
  children,
  className 
}: ExecutiveSummarySectionProps) {
  
  return (
    <div className={cn("flex flex-col w-full", ExecutiveSpacingRegistry.blockGap, className)}>
      
      <ExecutiveSurface variant="default" padding="lg" radius="lg" className="flex flex-col w-full">
        <ExecutiveDecisionPanel 
          question={question}
          statusBadge={<ExecutiveBadge variant={status.variant}>{status.label}</ExecutiveBadge>}
          opinion={opinion}
          driver={driver}
          implication={implication}
          executiveQuestion={executiveQuestion}
          confidence={technicalScore?.confidence}
          technicalIndex={technicalScore?.value ?? undefined}
        />
      </ExecutiveSurface>

      {/* 2. Evidence Grid */}
      {children && (
        <div className="w-full">
          {children}
        </div>
      )}
      
    </div>
  );
}
