import React from 'react';
import { Network } from 'lucide-react';
import { DependencyAnalysis } from '../../../core/runtime/consolidated/advisory/advisoryTypes';

export function IntercompanyDependencyMap({ dependencies }: { dependencies: DependencyAnalysis[] }) {
  if (!dependencies || dependencies.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Network size={20} className="text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Mapa de Dependência</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Laços Estruturais Intercompany</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {dependencies.map((dep, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{dep.sourceEntityId}</span>
                <span className="text-slate-400">→</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px]">{dep.targetEntityId}</span>
              </div>
              <span className="text-[9px] font-black uppercase text-indigo-600 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100">
                {dep.dependencyType}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">{dep.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
