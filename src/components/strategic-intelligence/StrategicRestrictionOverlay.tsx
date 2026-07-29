import React from 'react';
import { Lock } from 'lucide-react';
import { InstitutionalStrategicIntelligenceOutput } from '../../services/FiduciaryRuntimeAdapter';
// src/components/strategic-intelligence/StrategicRestrictionOverlay.tsx


interface StrategicRestrictionOverlayProps {
  strategicOutput: InstitutionalStrategicIntelligenceOutput;
}

export function StrategicRestrictionOverlay({ strategicOutput }: StrategicRestrictionOverlayProps) {
  
  const isRestricted = strategicOutput.posture === 'RESTRICTION_POSTURE' || strategicOutput.posture === 'CONTINUITY_POSTURE';

  if (!isRestricted) return null;

  return (
    <div className="bg-rose-950/40 border border-rose-500/30 p-4 rounded-lg flex items-center justify-center gap-3 animate-pulse">
      <Lock size={20} className="text-rose-500" />
      <span className="text-sm font-bold text-rose-400 uppercase tracking-widest">
        Fiduciary Strategic Restriction Active
      </span>
    </div>
  );
}
