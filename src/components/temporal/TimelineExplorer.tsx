import React from 'react';
import { Clock, Flag, RefreshCw, AlertTriangle, Shield, CheckCircle } from 'lucide-react';
import { TimelineEvent } from '../../types/temporal/TimelineEvent';
import { InstitutionalMilestone } from '../../types/temporal/InstitutionalMilestone';
import { useExecutiveFormatter } from "../../core/localization";

interface TimelineExplorerProps {
  events: TimelineEvent[];
  milestones: InstitutionalMilestone[];
  onSelectEvent: (eventId: string) => void;
  selectedEventId?: string;
}

export const TimelineExplorer: React.FC<TimelineExplorerProps> = ({ events, milestones, onSelectEvent, selectedEventId }) => {
    const formatter = useExecutiveFormatter();
  if (!events.length && !milestones.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface-container rounded-xl border border-border">
        <Clock size={32} className="text-muted-foreground mb-3" />
        <h3 className="text-sm font-semibold text-foreground">Timeline Vazia</h3>
        <p className="text-xs text-muted-foreground text-center mt-1">Nenhum evento registrado nesta linha do tempo institucional.</p>
      </div>
    );
  }

  // Merging events and milestones into a single chronological array
  const allItems = [
    ...events.map(e => ({ type: 'EVENT' as const, data: e, timestamp: e.timestamp })),
    ...milestones.map(m => ({ type: 'MILESTONE' as const, data: m, timestamp: m.timestamp }))
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="space-y-4">
      <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
        <Clock size={16} className="text-primary" /> Explorador Temporal
      </h3>
      
      <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/20 before:via-border before:to-transparent">
        {allItems.map((item, idx) => {
            const formatter = useExecutiveFormatter();
          const isSelected = item.type === 'EVENT' ? item.data.eventId === selectedEventId : false;
          
          if (item.type === 'MILESTONE') {
            const milestone = item.data as InstitutionalMilestone;
            return (
              <div key={`m-${milestone.milestoneId}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="absolute left-[-24px] w-6 h-6 rounded-full border-4 border-background bg-warning-soft0 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)] z-10">
                  <Flag size={10} className="text-white" />
                </div>
                <div className="bg-warning-soft0/10 border border-amber-500/20 rounded-xl p-4 w-full ml-4 shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500">
                      MARCO INSTITUCIONAL: {milestone.milestoneType}
                    </span>
                    <time className="text-[10px] text-amber-400 font-mono">
                      {formatter.date(milestone.timestamp)}
                    </time>
                  </div>
                  <h4 className="text-sm font-bold text-amber-50">{milestone.title}</h4>
                  <p className="text-xs text-amber-200/70 mt-1">{milestone.description}</p>
                </div>
              </div>
            );
          } else {
            const event = item.data as TimelineEvent;
            return (
              <div key={`e-${event.eventId}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active cursor-pointer" onClick={() => onSelectEvent(event.eventId)}>
                <div className={`absolute left-[-20px] w-4 h-4 rounded-full border-2 border-background z-10 transition-colors ${isSelected ? 'bg-insight' : 'bg-surface-container-highest group-hover:bg-insight'}`} />
                <div className={`rounded-xl p-4 w-full ml-4 transition-all ${isSelected ? 'bg-insight border border-insight shadow-lg shadow-indigo-500/10' : 'bg-surface-container border border-border hover:border-border-hover hover:bg-surface-container-high'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                      {event.eventType.replace(/_/g, ' ')}
                    </span>
                    <time className="text-[10px] text-muted-foreground font-mono">
                      {formatter.date(event.timestamp)}
                    </time>
                  </div>
                  <p className="text-xs text-foreground mt-1">{event.description}</p>
                  {event.sourceNodeId && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[9px] bg-surface-container-highest border border-border text-muted-foreground px-1.5 py-0.5 rounded uppercase tracking-wider">
                        Source ID: {event.sourceNodeId.substring(0, 8)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};
