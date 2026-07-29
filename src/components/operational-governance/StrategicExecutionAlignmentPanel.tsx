import React from 'react';
import { Compass, CheckCircle, XCircle } from 'lucide-react';
import { StrategicExecutionAlignment, OperationalGovernanceThesis } from '../../services/FiduciaryRuntimeAdapter';
// src/components/operational-governance/StrategicExecutionAlignmentPanel.tsx


interface StrategicExecutionAlignmentPanelProps {
  alignment: StrategicExecutionAlignment;
  thesis: OperationalGovernanceThesis;
}

export function StrategicExecutionAlignmentPanel({ alignment, thesis }: StrategicExecutionAlignmentPanelProps) {
  
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono flex flex-col h-full">
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
        <Compass size={14} /> Strategic Execution Alignment
      </h3>

      <div className={`p-4 rounded border mb-6 flex items-start gap-3 ${alignment.isAligned ? 'bg-emerald-950/20 border-emerald-900/50' : 'bg-red-950/20 border-red-900/50'}`}>
        <div className="mt-0.5">
          {alignment.isAligned ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
        </div>
        <div>
          <span className={`block text-[10px] uppercase font-bold tracking-widest mb-1 ${alignment.isAligned ? 'text-emerald-400' : 'text-red-400'}`}>
            {alignment.isAligned ? 'Alinhamento Operacional Ativo' : 'Desalinhamento Fiduciário Detectado'}
          </span>
          <p className="text-xs text-zinc-300 leading-relaxed font-semibold">
            {alignment.alignmentNarrative}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div>
          <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Tese Operacional Institucional</span>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {thesis.thesisStatement}
          </p>
          {thesis.primaryStrain && (
            <div className="mt-3 p-2 bg-orange-950/20 border border-orange-900/40 rounded">
              <span className="text-[9px] text-orange-500 uppercase font-bold tracking-widest block mb-1">Primary Strain</span>
              <span className="text-[11px] text-orange-200">{thesis.primaryStrain}</span>
            </div>
          )}
        </div>

        {alignment.tensions.length > 0 && (
          <div>
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Tensões de Execução</span>
            <ul className="space-y-2">
              {alignment.tensions.map((tension, idx) => (
                <li key={idx} className="text-[11px] text-zinc-400 bg-zinc-900/50 p-2 rounded border border-zinc-800/50 flex items-start gap-2">
                  <span className="text-zinc-600 mt-0.5">›</span> {tension}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
}
