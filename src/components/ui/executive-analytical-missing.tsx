import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';
import { cn } from '../../lib/utils';

interface ExecutiveAnalyticalMissingProps {
  reason: {
    type: string;
    title: string;
    explanation: string;
    impact: string;
  };
  className?: string;
}

export const ExecutiveAnalyticalMissing: React.FC<ExecutiveAnalyticalMissingProps> = ({ reason, className }) => {
  return (
    <ExecutiveSurface 
      padding="lg" 
      radius="md" 
      className={cn(
        "border border-dashed border-border/60 bg-surface-container/30 flex flex-col items-center justify-center text-center py-12",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-state-warning-soft/20 flex items-center justify-center mb-4 border border-state-warning-border">
        <AlertCircle className="w-6 h-6 text-state-warning-foreground" />
      </div>
      
      <ExecutiveHeading as="h3" variant="moduleTitle" className="mb-2">
        {reason.title}
      </ExecutiveHeading>
      
      <ExecutiveText as="p" variant="bodyStandard" className="text-executive-secondary max-w-md w-full mb-6">
        {reason.explanation}
      </ExecutiveText>

      <div className="bg-card border border-border rounded-md p-4 text-left w-full max-w-lg">
        <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-primary mb-1">
          Impacto Analítico
        </ExecutiveText>
        <ExecutiveText variant="bodyStandard" className="text-foreground">
          {reason.impact}
        </ExecutiveText>
      </div>
    </ExecutiveSurface>
  );
};
