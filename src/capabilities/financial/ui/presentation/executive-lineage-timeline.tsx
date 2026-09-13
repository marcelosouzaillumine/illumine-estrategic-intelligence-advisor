import React from 'react';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';

export interface LineageStage {
  stage: string;
  completed: boolean;
  timestamp?: string;
}

export interface ExecutiveLineageTimelineProps {
  stages: LineageStage[];
  className?: string;
}

const DEFAULT_STAGES = [
  'Evidence Collected',
  'Validation Performed',
  'Conflict Identified',
  'Reasoning Generated',
  'Recommendation Issued',
  'Board Decision',
  'Resolution Executed'
];

export function ExecutiveLineageTimeline({ stages, className = '' }: ExecutiveLineageTimelineProps) {
  const normalizedStages = DEFAULT_STAGES.map(name => {
    const matched = stages.find(s => s.stage === name);
    return {
      stage: name,
      completed: matched ? matched.completed : false,
      timestamp: matched?.timestamp
    };
  });

  return (
    <div className={`overflow-x-auto no-scrollbar py-2 ${className}`}>
      <div className="flex items-center gap-2 min-w-[700px]">
        {normalizedStages.map((st, idx) => {
          const isLast = idx === normalizedStages.length - 1;
          return (
            <React.Fragment key={st.stage}>
              <ExecutiveSurface padding="sm" radius="sm" className="flex items-center gap-2">
                {st.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                )}
                <span className={`text-[11px] font-mono whitespace-nowrap ${st.completed ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {st.stage}
                </span>
              </ExecutiveSurface>
              {!isLast && (
                <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${st.completed ? 'text-emerald-400/60' : 'text-muted-foreground/30'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
