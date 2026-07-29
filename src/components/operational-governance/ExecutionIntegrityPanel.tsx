import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { ExecutionIntegrityState } from '../../services/FiduciaryRuntimeAdapter';
// src/components/operational-governance/ExecutionIntegrityPanel.tsx


interface ExecutionIntegrityPanelProps {
  integrity: ExecutionIntegrityState;
}

export function ExecutionIntegrityPanel({ integrity }: ExecutionIntegrityPanelProps) {
  
  const getStatusDisplay = () => {
    switch(integrity.status) {
      case 'EXECUTION_STABLE':
        return { label: 'Execução Estável', color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-900/50', icon: CheckCircle2 };
      case 'EXECUTION_PRESSURED':
        return { label: 'Execução Pressionada', color: 'text-yellow-400', bg: 'bg-yellow-950/30', border: 'border-yellow-900/50', icon: AlertCircle };
      case 'EXECUTION_UNDER_COORDINATION_STRAIN':
        return { label: 'Strain Coordenativo', color: 'text-orange-400', bg: 'bg-orange-950/30', border: 'border-orange-900/50', icon: ShieldAlert };
      case 'EXECUTION_UNDER_STRAIN':
        return { label: 'Strain Executivo Severo', color: 'text-red-400', bg: 'bg-red-950/30', border: 'border-red-900/50', icon: ShieldAlert };
      default:
        return { label: 'Desconhecido', color: 'text-zinc-400', bg: 'bg-zinc-900', border: 'border-zinc-800', icon: Activity };
    }
  };

  const display = getStatusDisplay();
  const Icon = display.icon;

  return (
    <div className={`p-6 rounded-xl border font-mono ${display.bg} ${display.border}`}>
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
        <Activity size={14} /> Execution Integrity
      </h3>

      <div className="flex items-center gap-4 mb-4">
        <Icon size={32} className={display.color} />
        <div>
          <div className={`text-xl font-black uppercase tracking-tight ${display.color}`}>
            {display.label}
          </div>
          <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest mt-1">
            Confidence: <span className="text-zinc-300">{integrity.capabilityConfidence}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-2">
        {integrity.strainFactors.map((factor, idx) => (
          <div key={idx} className="text-xs text-zinc-300 flex items-start gap-2 bg-zinc-950/50 p-2 rounded border border-zinc-800/50">
            <span className="text-zinc-600 font-bold">›</span> {factor}
          </div>
        ))}
      </div>
    </div>
  );
}
