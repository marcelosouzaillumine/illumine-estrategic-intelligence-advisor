import React from 'react';
import { useExecutiveInteraction } from '../../context/executive-interaction/ExecutiveInteractionProvider';
import { Database, CheckCircle2, AlertOctagon, HelpCircle } from 'lucide-react';

export const GovernanceDataDependencyPanel: React.FC = () => {
  const { dependencies } = useExecutiveInteraction();

  if (!dependencies || dependencies.length === 0) {
    return null;
  }

  return (
    <div className="card-premium p-8 space-y-6">
      <div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-secondary" />
          Dependências e Fontes do Runtime
        </h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Status das origens de dados verificadas e integridade criptográfica associada.
        </p>
      </div>

      <div className="divide-y divide-border/10">
        {dependencies.map(dep => {
          const isAvailable = dep.status === 'available';
          const isStale = dep.status === 'stale';

          return (
            <div key={dep.id} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-200">{dep.name}</span>
                  <span className="text-[9px] uppercase font-mono tracking-widest px-2 py-0.5 bg-slate-900 border border-border/5 rounded-xl text-slate-500">
                    {dep.type}
                  </span>
                </div>
                {dep.lineageHash && (
                  <p className="text-[10px] font-mono text-slate-500">Lineage Hash: {dep.lineageHash}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {dep.updatedAt && (
                  <span className="text-[10px] text-slate-500 font-mono">Sync: {dep.updatedAt}</span>
                )}
                {isAvailable ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Ativo
                  </span>
                ) : isStale ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    Obsoleto
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    Pendente
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
