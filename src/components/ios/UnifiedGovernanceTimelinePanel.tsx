import React from 'react';
import { InstitutionalOperatingSystem } from '../../services/FiduciaryRuntimeAdapter';
import { GitCommit } from 'lucide-react';
import { useExecutiveFormatter } from "../../core/localization";

export function UnifiedGovernanceTimelinePanel({ tenantId }: { tenantId: string }) {
    const formatter = useExecutiveFormatter();
  const state = InstitutionalOperatingSystem.getState(tenantId);
  if (!state) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <GitCommit className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Unified Governance Timeline</h3>
      </div>
      
      <div className="relative border-l border-border/50 ml-3 space-y-6">
        {state.timeline.map((evt) => {
            const formatter = useExecutiveFormatter();
          let color = 'bg-primary';
          let border = 'border-primary';
          if (evt.severity === 'CRITICAL') { color = 'bg-critical-soft0'; border = 'border-rose-500'; }
          if (evt.severity === 'WARNING') { color = 'bg-warning-soft0'; border = 'border-amber-500'; }

          return (
            <div key={evt.eventId} className="relative pl-6">
              <div className={'absolute w-3 h-3 ' + color + ' rounded-full -left-1.5 top-1.5 border-2 border-background'}></div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-bold text-foreground">{evt.title}</span>
                <span className="text-[10px] text-muted-foreground uppercase">{formatter.date(evt.timestamp)}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">{evt.description}</div>
              <div className="text-[10px] font-bold text-insight uppercase">{evt.domain.replace(/_/g, ' ')}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
