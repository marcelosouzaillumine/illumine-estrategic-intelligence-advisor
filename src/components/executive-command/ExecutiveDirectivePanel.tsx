// src/components/executive-command/ExecutiveDirectivePanel.tsx

import React from 'react';
import { ShieldCheck, AlertTriangle, ChevronRight, Anchor } from 'lucide-react';
import { ExecutiveDirective } from '../../services/FiduciaryRuntimeAdapter';

interface ExecutiveDirectivePanelProps {
  directives: ExecutiveDirective[];
}

export function ExecutiveDirectivePanel({ directives }: ExecutiveDirectivePanelProps) {
  if (directives.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono text-center space-y-4">
        <ShieldCheck size={24} className="mx-auto text-emerald-500" />
        <h3 className="text-zinc-300 font-bold tracking-widest uppercase">Nenhuma Diretiva Cautelar Ativa</h3>
        <p className="text-zinc-500 text-xs">O espaço de atuação executivo não possui restrições fiduciárias iminentes detectadas.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono w-full">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
        <Anchor size={14} />
        Executive Directives (Fiduciary Guidance)
      </h3>
      
      <div className="space-y-4">
        {directives.map(directive => {
          const isCritical = directive.severity === 'CRITICAL' || directive.severity === 'RESTRICTIVE';
          
          return (
            <div 
              key={directive.id} 
              className={`p-4 rounded border ${
                isCritical ? 'bg-red-950/20 border-red-900/40' : 'bg-orange-950/20 border-orange-900/40'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isCritical ? <AlertTriangle size={14} className="text-red-500" /> : <AlertTriangle size={14} className="text-orange-500" />}
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${isCritical ? 'text-red-400' : 'text-orange-400'}`}>
                    {directive.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[9px] text-zinc-500 uppercase px-2 py-0.5 border border-zinc-800 rounded">
                  {directive.status}
                </span>
              </div>
              
              <h4 className="text-sm text-zinc-200 font-bold mb-1">{directive.title}</h4>
              <p className="text-xs text-zinc-400 mb-3">{directive.statement}</p>
              
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-zinc-800/50">
                <span className="text-[9px] text-zinc-600 font-bold uppercase">Causal Drivers:</span>
                {directive.causalDrivers.map((driver, idx) => (
                  <span key={idx} className="text-[9px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    {driver}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
