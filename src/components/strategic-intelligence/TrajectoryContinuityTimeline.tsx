// src/components/strategic-intelligence/TrajectoryContinuityTimeline.tsx

import React from 'react';
import { Route } from 'lucide-react';
import { LongitudinalTrajectoryStatus } from '../../core/runtime/strategic-intelligence/strategic-intelligence-types';

interface TrajectoryContinuityTimelineProps {
  status: LongitudinalTrajectoryStatus;
}

export function TrajectoryContinuityTimeline({ status }: TrajectoryContinuityTimelineProps) {
  
  const getDisplayConfig = () => {
    switch(status) {
      case 'TRAJECTORY_STABLE': return { color: 'emerald', text: 'STABLE', label: 'Longitudinal continuity preserved' };
      case 'TRAJECTORY_SENSITIVE': return { color: 'yellow', text: 'SENSITIVE', label: 'Strained longitudinal direction' };
      case 'TRAJECTORY_PRESSURED': return { color: 'orange', text: 'PRESSURED', label: 'Accumulated structural deterioration' };
      case 'TRAJECTORY_UNSTABLE': return { color: 'rose', text: 'UNSTABLE', label: 'Critical directional divergence' };
      default: return { color: 'zinc', text: 'UNKNOWN', label: 'Insufficient historical data' };
    }
  };

  const config = getDisplayConfig();

  return (
    <div className={`p-6 rounded-lg font-mono border h-full flex flex-col justify-center bg-${config.color}-950/10 border-${config.color}-900/40`}>
      <h3 className={`text-${config.color}-500/80 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2`}>
        <Route size={14} /> Longitudinal Trajectory
      </h3>
      
      <div>
        <span className={`text-xl font-black text-${config.color}-400 uppercase tracking-widest block mb-1`}>
          {config.text}
        </span>
        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
          {config.label}
        </span>
      </div>
    </div>
  );
}
