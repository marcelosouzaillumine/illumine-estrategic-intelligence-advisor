import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveBadge, ExecutiveBadgeVariant } from './executive-badge';
import { ExecutiveDiagnosticPanel } from './executive-diagnostic-panel';
import { ExecutiveSpacingRegistry } from './executive-typography';
import { ExecutiveSurface } from './executive-surface';

export interface ExecutiveDiagnosticSummarySectionProps {
  status: {
    label: string;
    variant: ExecutiveBadgeVariant;
  };
  question: string;
  observation: string;
  evidence: string;
  financialMeaning: string;
  executiveQuestion?: string;
  technicalScore?: {
    value: number | string | null;
    confidence?: string;
  };
  children?: React.ReactNode;
  className?: string;
}

export function ExecutiveDiagnosticSummarySection({ 
  status,
  question,
  observation,
  evidence,
  financialMeaning,
  executiveQuestion,
  technicalScore,
  children,
  className 
}: ExecutiveDiagnosticSummarySectionProps) {
  
  return (
    <div className={cn("flex flex-col w-full", ExecutiveSpacingRegistry.blockGap, className)}>
      
      <ExecutiveSurface variant="default" padding="lg" radius="lg" className="flex flex-col w-full">
        <ExecutiveDiagnosticPanel 
          question={question}
          statusBadge={<ExecutiveBadge variant={status.variant}>{status.label}</ExecutiveBadge>}
          observation={observation}
          evidence={evidence}
          financialMeaning={financialMeaning}
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
