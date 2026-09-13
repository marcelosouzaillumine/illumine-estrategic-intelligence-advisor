import React from 'react';
import { Expand, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { ExpansionSustainability } from '../../../../services/FiduciaryRuntimeAdapter';
// src/components/strategic-intelligence/ExpansionSustainabilityPanel.tsx


interface ExpansionSustainabilityPanelProps {
  sustainability: ExpansionSustainability;
}

export function ExpansionSustainabilityPanel({ sustainability }: ExpansionSustainabilityPanelProps) {
  
  const isSustainable = sustainability.isSustainable;

  return (
    <div className={`p-6 rounded-lg font-mono border h-full flex flex-col ${isSustainable ? 'bg-zinc-950 border-zinc-800' : 'bg-orange-950/20 border-orange-900/50'}`}>
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
        <Expand size={14} /> Expansion Sustainability
      </h3>

      <div className="flex items-center gap-3 mb-6">
        {isSustainable ? (
          <CheckCircle2 size={20} className="text-emerald-500" />
        ) : (
          <XCircle size={20} className="text-orange-500" />
        )}
        <span className={`text-sm font-bold uppercase tracking-widest ${isSustainable ? 'text-emerald-400' : 'text-orange-400'}`}>
          {isSustainable ? 'Structurally Sustainable' : 'Structural Pressure Detected'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Capacity</span>
          <span className="text-xs font-bold text-zinc-300 uppercase">{sustainability.structuralCapacity}</span>
        </div>
        <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Financials</span>
          <span className={`text-xs font-bold uppercase ${sustainability.financialSustainability === 'UNSUSTAINABLE' ? 'text-rose-400' : sustainability.financialSustainability === 'PRESSURED' ? 'text-orange-400' : 'text-emerald-400'}`}>
            {sustainability.financialSustainability}
          </span>
        </div>
        <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800/80">
          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-1">Absorption</span>
          <span className={`text-xs font-bold uppercase ${sustainability.institutionalAbsorption === 'OVERLOADED' ? 'text-rose-400' : sustainability.institutionalAbsorption === 'STRAINED' ? 'text-orange-400' : 'text-emerald-400'}`}>
            {sustainability.institutionalAbsorption}
          </span>
        </div>
      </div>

      <div className="mt-auto bg-zinc-900/30 p-3 border-l-2 border-zinc-700">
        <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
          {sustainability.rationale}
        </p>
      </div>
    </div>
  );
}
