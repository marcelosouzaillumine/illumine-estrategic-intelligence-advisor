import React from 'react';
import { ExecutiveNarrative } from '../../../services/FiduciaryRuntimeAdapter';
import { useExecutiveFormatter } from '../../../core/localization';

interface InstitutionalTimelineViewerProps {
  narrative: ExecutiveNarrative;
}

export const InstitutionalTimelineViewer: React.FC<InstitutionalTimelineViewerProps> = ({ narrative }) => {
  const formatter = useExecutiveFormatter();
  // We extract a timeline only from the runtime execution metrics/evidence. No local sorting of ad-hoc dates.
  const timelineEvents = narrative.evidenceChain.map(evidence => ({
    id: evidence.evidenceId,
    timestamp: evidence.timestamp,
    nodes: evidence.sourceNodes,
    critical: narrative.violations.some(v => evidence.sourceNodes.includes(v.sourceContext) && v.severity === 'CRITICAL')
  }));

  if (timelineEvents.length === 0) {
    return null;
  }

  return (
    <div className="p-6 bg-primary border border-border rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-6">Historical Causality Timeline</h3>
      <div className="relative border-l border-border ml-3 space-y-6">
        {timelineEvents.map(event => (
          <div key={event.id} className="relative pl-6">
            <div className={`absolute -left-1.5 top-1.5 w-3 h-3 rounded-full ${event.critical ? 'bg-red-500' : 'bg-primary'}`}></div>
            <div className="mb-1 text-sm font-mono text-muted-foreground">
              {formatter.date(event.timestamp)}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-semibold text-white">Event Reference:</span> {event.id}
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {event.nodes.map(node => (
                <span key={node} className="text-sm px-2 py-0.5 bg-surface rounded text-muted-foreground">
                  {node}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
