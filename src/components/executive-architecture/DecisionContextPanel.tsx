import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { Briefcase, Target, HelpCircle } from 'lucide-react';

interface DecisionContextPanelProps {
  context: {
    decisionType: string;
    decisionObjective: string;
    strategicQuestion: string;
  };
}

export function DecisionContextPanel({ context }: DecisionContextPanelProps) {
  if (!context) return null;

  return (
    <ExecutiveSurface variant="default" padding="xl" radius="xl" className="border border-border">
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={16} className="text-executive-primary" />
            <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-widest">
              DECISION TYPE
            </ExecutiveText>
          </div>
          <ExecutiveHeading as="h4" className="text-foreground text-lg">{context.decisionType}</ExecutiveHeading>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-executive-secondary" />
            <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-widest">
              DECISION OBJECTIVE
            </ExecutiveText>
          </div>
          <ExecutiveText variant="body" className="text-foreground text-base">
            {context.decisionObjective}
          </ExecutiveText>
        </div>

        <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle size={18} className="text-primary" />
            <ExecutiveText variant="microLabel" className="text-primary uppercase tracking-widest font-bold">
              STRATEGIC QUESTION
            </ExecutiveText>
          </div>
          <ExecutiveHeading as="h3" className="text-primary text-xl leading-relaxed">
            {context.strategicQuestion}
          </ExecutiveHeading>
        </div>
      </div>
    </ExecutiveSurface>
  );
}
