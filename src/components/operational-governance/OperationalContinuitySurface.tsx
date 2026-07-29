import React from 'react';
import { Shield, ShieldAlert, HeartPulse } from 'lucide-react';
import { OperationalContinuityState } from '../../services/FiduciaryRuntimeAdapter';
// src/components/operational-governance/OperationalContinuitySurface.tsx


interface OperationalContinuitySurfaceProps {
  continuity: OperationalContinuityState;
}

export function OperationalContinuitySurface({ continuity }: OperationalContinuitySurfaceProps) {
  
  const getContinuityDisplay = () => {
    switch(continuity.status) {
      case 'CONTINUITY_STABLE': return 'text-emerald-400 bg-emerald-950/20 border-emerald-900/50';
      case 'CONTINUITY_SENSITIVE': return 'text-yellow-400 bg-yellow-950/20 border-yellow-900/50';
      case 'CONTINUITY_PRESSURED': return 'text-orange-400 bg-orange-950/20 border-orange-900/50';
      case 'CONTINUITY_RESTRICTED': return 'text-red-400 bg-red-950/20 border-red-900/50';
      default: return 'text-zinc-500 bg-zinc-900/20 border-zinc-800';
    }
  };

  const isRestricted = continuity.status.includes('RESTRICTED') || continuity.status.includes('PRESSURED');

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
        <HeartPulse size={14} /> Operational Continuity
      </h3>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Resilience Score</span>
          <span className="text-2xl font-black text-zinc-200">{continuity.resilienceScore}<span className="text-sm text-zinc-500">%</span></span>
        </div>

        <div className={`px-4 py-3 rounded border flex items-center gap-3 ${getContinuityDisplay()}`}>
          {isRestricted ? <ShieldAlert size={20} /> : <Shield size={20} />}
          <span className="text-sm uppercase font-bold tracking-widest">
            {continuity.status.replace(/_/g, ' ')}
          </span>
        </div>

        <div className="mt-2 space-y-2">
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Fatores de Estabilidade</span>
          {continuity.stabilityFactors.map((factor, idx) => (
            <div key={idx} className="text-xs text-zinc-400 bg-zinc-900/30 p-2 rounded border border-zinc-800/40">
              {factor}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
