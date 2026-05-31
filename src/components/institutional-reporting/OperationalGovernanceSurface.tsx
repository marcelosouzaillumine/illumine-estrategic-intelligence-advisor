// src/components/institutional-reporting/OperationalGovernanceSurface.tsx

import React from 'react';
import { Activity, AlertOctagon } from 'lucide-react';
import { OperationalGovernanceSection } from '../../core/runtime/institutional-reporting/institutional-reporting-types';

export function OperationalGovernanceSurface({ data }: { data: OperationalGovernanceSection }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h2 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-zinc-800 pb-2">
        <Activity size={14} /> Operational Execution State
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Execution Status</span>
          <span className={`text-sm font-bold uppercase tracking-widest ${data.executionStatus === 'EXECUTION_UNSTABLE' ? 'text-rose-400' : 'text-emerald-400'}`}>
            {data.executionStatus.replace(/_/g, ' ')}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Continuity Strain</span>
          <span className="text-sm font-bold uppercase tracking-widest text-zinc-300">
            {data.continuityStrain.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {data.operationalFrictions.length > 0 && (
        <div className="bg-orange-950/20 border border-orange-900/50 p-4 rounded">
          <h3 className="text-[9px] text-orange-500 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
            <AlertOctagon size={12} /> Observable Operational Frictions
          </h3>
          <ul className="space-y-1">
            {data.operationalFrictions.map((f, i) => (
              <li key={i} className="text-[10px] text-orange-300/80 font-bold tracking-widest uppercase">
                • {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
