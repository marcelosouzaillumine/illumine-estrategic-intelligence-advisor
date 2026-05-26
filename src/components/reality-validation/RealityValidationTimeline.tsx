import React from 'react';
import { Clock } from 'lucide-react';
import { GoldenDatasetProfile } from '../../core/runtime/reality-validation/RealityValidationTypes';

interface Props { dataset: GoldenDatasetProfile }

export function RealityValidationTimeline({ dataset }: Props) {
  const events = dataset.governanceEvents.map((e, i) => ({
    id: i,
    label: e,
    type: e.includes('Early Warning') ? 'WARNING' : e.includes('Orchestration') ? 'ORCHESTRATION' : 'IOS'
  }));

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-foreground">Reality Validation Timeline</h3>
        <span className="ml-auto text-[10px] text-muted-foreground font-mono">{dataset.lineageHash}</span>
      </div>
      <div className="relative border-l border-border/50 ml-3 space-y-5">
        {events.map(evt => {
          const dot = evt.type === 'WARNING' ? 'bg-rose-500' : evt.type === 'ORCHESTRATION' ? 'bg-amber-500' : 'bg-indigo-500';
          return (
            <div key={evt.id} className="relative pl-5">
              <div className={`absolute w-2.5 h-2.5 ${dot} rounded-full -left-1.5 top-1`} />
              <div className="text-xs text-foreground">{evt.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{evt.type}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
