import React from 'react';
import { SimulationIntegrityState } from '../../core/runtime/scenario-simulation/types';

interface ForecastIntegrityBadgeProps {
  state: SimulationIntegrityState;
}

export const ForecastIntegrityBadge: React.FC<ForecastIntegrityBadgeProps> = ({ state }) => {
  let badgeStyles = 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30';
  let label = 'VERIFIED LINEAGE';
  let dotColor = 'bg-emerald-400';

  if (state === 'DEGRADED') {
    badgeStyles = 'bg-amber-950/40 text-amber-400 border-amber-500/30';
    label = 'DEGRADED INTEGRITY';
    dotColor = 'bg-amber-400';
  } else if (state === 'FAIL_CLOSED') {
    badgeStyles = 'bg-rose-950/40 text-rose-400 border-rose-500/30 animate-pulse';
    label = 'FAIL CLOSED LOCK';
    dotColor = 'bg-rose-400';
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono tracking-wider ${badgeStyles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {label}
    </div>
  );
};
