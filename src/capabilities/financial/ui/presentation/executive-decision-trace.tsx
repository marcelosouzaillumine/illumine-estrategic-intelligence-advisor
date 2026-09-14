import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { Activity } from 'lucide-react';

export interface DecisionTraceNode {
  type: 'question' | 'opinion' | 'driver' | 'implication' | 'action' | 'kpis' | 'engine' | 'source';
  label: string;
  content: React.ReactNode;
}

export interface ExecutiveDecisionTraceProps {
  trace: DecisionTraceNode[];
  className?: string;
}

export function ExecutiveDecisionTrace({ trace, className }: ExecutiveDecisionTraceProps) {
  if (!trace || trace.length === 0) return null;

  return (
    <ExecutiveAccordion
      variant="analytics"
      icon={<Activity />}
      title="Rastreabilidade da Decisão (Decision Trace)"
      subtitle="Cadeia de causalidade analítica: da pergunta executiva aos dados de origem."
      className={className}
    >
      <div className="flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {trace.map((node, idx) => (
          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface bg-surface-container shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="text-[10px] font-bold text-executive-muted">{idx + 1}</span>
            </div>
            
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border shadow-sm bg-surface-high">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-executive-muted">{node.label}</span>
              </div>
              <ExecutiveText variant="bodyStandard" className="text-executive-primary">
                {node.content}
              </ExecutiveText>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveAccordion>
  );
}
