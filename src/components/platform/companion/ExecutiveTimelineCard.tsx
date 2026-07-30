import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { History, Calendar, CheckCircle, Lightbulb } from 'lucide-react';
import { ExecutiveTimelineContract } from '../../../../packages/domain/executive-contracts/src/companion/ExecutiveTimelineContract';

export interface ExecutiveTimelineCardProps {
  readonly timeline?: ExecutiveTimelineContract;
}

export const ExecutiveTimelineCard: React.FC<ExecutiveTimelineCardProps> = ({ timeline }) => {
  if (!timeline) return null;

  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-purple-500/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-sm text-foreground">Executive Timeline™ Institucional</h3>
        </div>
        <ExecutiveBadge variant="info" className="font-mono">
          {timeline.totalEventsCount} Marcos Históricos
        </ExecutiveBadge>
      </div>
      <div className="space-y-2.5 text-xs">
        {timeline.events.map((evt) => (
          <div key={evt.eventId} className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-300 text-xs">{evt.title}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{evt.dateIso}</span>
            </div>
            <p className="text-muted-foreground text-[11px]">{evt.impactDescription}</p>
            <div className="flex items-center justify-between pt-1 text-[10px]">
              <span className="font-mono text-emerald-400 font-semibold">{evt.valueGeneratedFormatted}</span>
              <span className="text-muted-foreground italic flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" /> {evt.keyLearningText}
              </span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
