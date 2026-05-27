import React from 'react';
import { DemoScenario } from '../../../core/runtime/executive/demo/ExecutiveDemoScenarioRegistry';

interface InstitutionalScenarioTimelineProps {
  scenario: DemoScenario;
}

export const InstitutionalScenarioTimeline: React.FC<InstitutionalScenarioTimelineProps> = ({ scenario }) => {
  // Dummy Renderer Principle: No local timeline reconstruction. Read directly from the audited scenario timeline.
  if (!scenario.timelineEvents || !Array.isArray(scenario.timelineEvents)) {
    throw new Error('DUMMY_RENDERER_VIOLATION: Local timeline reconstruction is prohibited. Timeline events must be supplied by the runtime.');
  }

  const events = scenario.timelineEvents;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
      <h3 className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
        Institutional Causal Timeline
      </h3>
      <div className="relative border-l border-slate-800 pl-6 space-y-6">
        {events.map((ev, index) => (
          <div key={index} className="relative">
            <span className={`absolute -left-[30px] top-1.5 w-3.5 h-3.5 rounded-full border-4 border-slate-900 ${
              ev.status === 'Stable' || ev.status === 'Stabilized' || ev.status === 'Normal'
                ? 'bg-emerald-500'
                : ev.status === 'Warning'
                ? 'bg-amber-500'
                : 'bg-red-500'
            }`} />
            <div>
              <span className="text-xs font-mono text-slate-500">{ev.phase}</span>
              <h4 className="text-sm font-bold text-slate-200 mt-0.5">{ev.status}</h4>
              <p className="text-xs text-slate-400 mt-1">{ev.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
