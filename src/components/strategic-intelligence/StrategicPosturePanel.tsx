import React from 'react';
import { Target, Activity, ShieldCheck, TrendingUp, AlertTriangle } from 'lucide-react';
import { StrategicPosture } from '../../services/FiduciaryRuntimeAdapter';
// src/components/strategic-intelligence/StrategicPosturePanel.tsx


interface StrategicPosturePanelProps {
  posture: StrategicPosture;
}

export function StrategicPosturePanel({ posture }: StrategicPosturePanelProps) {
  
  const getDisplayConfig = () => {
    switch(posture) {
      case 'EXPANSION_POSTURE': return { color: 'emerald', text: 'EXPANSION', icon: TrendingUp, bg: 'bg-emerald-950/20', border: 'border-emerald-900/50' };
      case 'PRESERVATION_POSTURE': return { color: 'blue', text: 'PRESERVATION', icon: ShieldCheck, bg: 'bg-blue-950/20', border: 'border-blue-900/50' };
      case 'STABILIZATION_POSTURE': return { color: 'yellow', text: 'STABILIZATION', icon: Activity, bg: 'bg-yellow-950/20', border: 'border-yellow-900/50' };
      case 'RESTRICTION_POSTURE': return { color: 'rose', text: 'RESTRICTION', icon: AlertTriangle, bg: 'bg-rose-950/20', border: 'border-rose-900/50' };
      case 'CONTINUITY_POSTURE': return { color: 'primary', text: 'CONTINUITY', icon: Target, bg: 'bg-primary', border: 'border-primary' };
      default: return { color: 'zinc', text: 'UNVERIFIABLE', icon: Target, bg: 'bg-zinc-900/20', border: 'border-zinc-800' };
    }
  };

  const config = getDisplayConfig();
  const Icon = config.icon;

  return (
    <div className={`p-6 rounded-lg font-mono border h-full flex flex-col justify-center ${config.bg} ${config.border}`}>
      <h3 className={`text-${config.color}-500/80 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2`}>
        <Target size={14} /> Observed Institutional Posture
      </h3>
      
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full border bg-${config.color}-900/20 border-${config.color}-500/30`}>
          <Icon size={24} className={`text-${config.color}-400`} />
        </div>
        <div>
          <span className={`text-2xl font-black text-${config.color}-400 uppercase tracking-widest block`}>
            {config.text}
          </span>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
            Structural Direction
          </span>
        </div>
      </div>
    </div>
  );
}
