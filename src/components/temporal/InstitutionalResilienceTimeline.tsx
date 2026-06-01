import React from 'react';
import { TemporalEvent } from '../../core/runtime/institutional-memory/types';
import { useLanguage } from '../../i18n/LanguageContext';

interface ResilienceTimelineProps {
  events: TemporalEvent[];
}

export const InstitutionalResilienceTimeline: React.FC<ResilienceTimelineProps> = ({ events }) => {
  const { t } = useLanguage();
  if (!events || events.length === 0) {
    return null; // Dummy Renderer
  }

  // Sort events chronologically (assuming timestamp is ISO string)
  const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getEventColor = (type: string) => {
    switch(type) {
      case 'RECOVERY': return 'bg-green-500';
      case 'DETERIORATION': return 'bg-red-500';
      case 'ESCALATION': return 'bg-orange-500';
      case 'ADVISORY_ACKNOWLEDGEMENT': return 'bg-blue-500';
      case 'WORKFLOW_COMPLETION': return 'bg-emerald-500';
      case 'RECURRENCE_MILESTONE': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="institutional-resilience-timeline p-6 bg-slate-900 border border-slate-700 rounded-lg shadow-md text-slate-100">
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h3 className="text-lg font-semibold text-slate-50">{t('summary.resilience_evolution')}</h3>
        <p className="text-xs text-slate-400 mt-1">{t('summary.chronological_mapping')}</p>
      </div>

      <div className="relative border-l border-slate-700 ml-3 pl-6 space-y-6">
        {sortedEvents.map((event) => (
          <div key={event.eventId} className="relative">
            <div className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${getEventColor(event.eventType)}`} />
            
            <div className="bg-slate-800 p-4 rounded-md border border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase text-white ${getEventColor(event.eventType).replace('bg-', 'bg-opacity-80 bg-')}`}>
                  {event.eventType.replace(/_/g, ' ')}
                </span>
                <div className="text-right">
                  <div className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
              <p className="text-sm text-slate-300 mt-2">{event.description}</p>
              <div className="flex gap-4 mt-3 pt-2 border-t border-slate-700 text-xs font-mono text-slate-500">
                <span>{t('summary.ref')} {event.auditReference}</span>
                <span>{t('summary.lineage')} {event.lineageHash.substring(0, 8)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
