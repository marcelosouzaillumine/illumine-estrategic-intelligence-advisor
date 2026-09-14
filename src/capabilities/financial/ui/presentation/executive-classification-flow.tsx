import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ChevronRight } from 'lucide-react';

export interface ExecutiveClassificationStep {
  label: string;
  value: React.ReactNode;
}

export interface ExecutiveClassificationFlowProps {
  steps: ExecutiveClassificationStep[];
  className?: string;
}

export function ExecutiveClassificationFlow({
  steps,
  className
}: ExecutiveClassificationFlowProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className={cn("flex flex-col sm:flex-row items-center gap-4 sm:gap-6 bg-surface-container/30 p-5 rounded-2xl border border-border overflow-x-auto", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        return (
          <React.Fragment key={index}>
            {/* Step Node */}
            <div className={cn("flex flex-col items-center sm:items-start min-w-[120px]", isLast ? "flex-1 sm:items-end text-center sm:text-right" : "")}>
              <ExecutiveText as="span" variant="caption" className="text-executive-muted mb-1">
                {step.label}
              </ExecutiveText>
              <ExecutiveText as="span" variant="bodyStandard" className="text-executive-secondary">
                {step.value}
              </ExecutiveText>
            </div>
            
            {/* Flow Connector */}
            {!isLast && (
              <div className="flex items-center justify-center shrink-0 text-border text-executive-muted">
                <ChevronRight className="w-5 h-5 hidden sm:block" />
                <div className="h-4 w-px bg-border sm:hidden my-1"></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
