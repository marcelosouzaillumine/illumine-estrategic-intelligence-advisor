import React from 'react';
import { SimulationIntegrityState } from '../../core/runtime/scenario-simulation/types';

interface ForecastIntegrityBadgeProps {
  state: SimulationIntegrityState;
}

export const ForecastIntegrityBadge: React.FC<ForecastIntegrityBadgeProps> = ({ state }) => {
  let badgeStyles = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  let label = 'VERIFIED LINEAGE';
  let dotColor = 'bg-emerald-500';

  if (state === 'DEGRADED') {
    badgeStyles = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    label = 'DEGRADED INTEGRITY';
    dotColor = 'bg-amber-500';
  } else if (state === 'FAIL_CLOSED') {
    badgeStyles = 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse';
    label = 'FAIL CLOSED LOCK';
    dotColor = 'bg-rose-500';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono tracking-widest font-bold ${badgeStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </div>
  );
};
