import React from 'react';
import { Lock, FileSignature } from 'lucide-react';
import { GovernanceExecutionTracking } from '../../../../services/FiduciaryRuntimeAdapter';
// src/components/executive-command/GovernanceRestrictionOverlay.tsx


interface GovernanceRestrictionOverlayProps {
  tracking: GovernanceExecutionTracking;
}

export function GovernanceRestrictionOverlay({ tracking }: GovernanceRestrictionOverlayProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
        <Lock size={14} />
        Governance Execution Ledger
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded text-center">
          <span className="block text-2xl font-black text-zinc-200 mb-1">{tracking.pendingDirectivesCount}</span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Diretivas Pendentes</span>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded text-center">
          <span className="block text-2xl font-black text-zinc-200 mb-1">{tracking.resolvedDirectivesCount}</span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Resoluções Aprovadas</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded text-center">
          <span className="block text-2xl font-black text-zinc-200 mb-1">{tracking.recurringDriftCount}</span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Drifts Recorrentes</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded text-center">
          <span className="block text-2xl font-black text-zinc-200 mb-1">{tracking.executionRate}%</span>
          <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Taxa de Execução</span>
        </div>
      </div>
      
      <div className="mt-6 p-3 bg-zinc-900/30 border border-zinc-800 rounded flex items-center gap-3">
        <FileSignature size={16} className="text-zinc-500" />
        <p className="text-[10px] text-zinc-400 leading-relaxed">
          Toda resolução de Board deve ser rastreada contra uma diretiva. Registros de memória são append-only.
        </p>
      </div>
    </div>
  );
}
