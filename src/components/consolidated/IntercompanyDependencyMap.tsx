import React from 'react';
import { Network } from 'lucide-react';
import { DependencyAnalysis } from '../../services/FiduciaryRuntimeAdapter';

export function IntercompanyDependencyMap({ dependencies }: { dependencies: DependencyAnalysis[] }) {
  if (!dependencies || dependencies.length === 0) return null;

  return (
    <div className="bg-white rounded-[32px] p-8 border border-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Network size={20} className="text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Mapa de Dependência</h3>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mt-0.5">Laços Estruturais Intercompany</p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {dependencies.map((dep, idx) => (
          <div key={idx} className="p-4 rounded-xl border border-border bg-slate-50/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                <span className="px-2 py-1 bg-white border border-border rounded text-[10px]">{dep.sourceEntityId}</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-2 py-1 bg-white border border-border rounded text-[10px]">{dep.targetEntityId}</span>
              </div>
              <span className="text-[9px] font-black uppercase text-primary px-2 py-0.5 rounded-full bg-primary border border-primary">
                {dep.dependencyType}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground">{dep.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
