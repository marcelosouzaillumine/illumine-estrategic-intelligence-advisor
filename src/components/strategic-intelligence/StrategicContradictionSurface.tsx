import React from 'react';
import { AlertOctagon, Activity } from 'lucide-react';
import { StrategicContradiction } from '../../services/FiduciaryRuntimeAdapter';
// src/components/strategic-intelligence/StrategicContradictionSurface.tsx


interface StrategicContradictionSurfaceProps {
  contradictions: StrategicContradiction[];
}

export function StrategicContradictionSurface({ contradictions }: StrategicContradictionSurfaceProps) {
  
  if (contradictions.length === 0) {
    return (
      <div className="bg-emerald-950/20 border border-emerald-900/50 p-6 rounded-lg font-mono h-full flex flex-col items-center justify-center text-center">
        <Activity size={32} className="text-emerald-500/50 mb-4" />
        <span className="text-emerald-400 font-bold uppercase tracking-widest text-sm">No Strategic Contradictions</span>
        <span className="text-[10px] text-emerald-500/70 uppercase tracking-widest mt-2 block">Structural direction is coherent</span>
      </div>
    );
  }

  return (
    <div className="bg-rose-950/20 border border-rose-900/50 p-6 rounded-lg font-mono h-full flex flex-col">
      <h3 className="text-rose-500/80 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
        <AlertOctagon size={14} /> Structural Contradictions Detected
      </h3>
      
      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {contradictions.map((c, i) => (
          <div key={i} className="bg-rose-900/20 border border-rose-800/50 p-4 rounded">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] text-rose-400 font-bold tracking-widest uppercase block mb-1">
                  {c.type.replace(/_/g, ' ')}
                </span>
                <p className="text-xs text-rose-200/80 leading-relaxed font-semibold">
                  {c.description}
                </p>
              </div>
              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded ${['CRITICAL'].includes(c.severity) ? 'bg-critical-soft0/20 text-rose-300' : 'bg-orange-500/20 text-orange-300'}`}>
                {c.severity}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-800/30">
              <span className="text-[9px] text-rose-500/70 font-bold uppercase tracking-widest">Involved Engines:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {c.involvedEngines.map(e => (
                  <span key={e} className="text-[9px] text-zinc-400 font-medium">{e}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
