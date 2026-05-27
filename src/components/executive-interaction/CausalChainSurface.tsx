import React, { useState } from 'react';
import { ArrowRight, Activity, Network, ShieldCheck } from 'lucide-react';
import { CausalEdge } from '../../core/runtime/executive-interaction/types';

interface CausalChainSurfaceProps {
  chains?: CausalEdge[];
}

export const CausalChainSurface: React.FC<CausalChainSurfaceProps> = ({
  chains = []
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const defaultChains: CausalEdge[] = [
    { sourceId: 'op-1', sourceLabel: 'Diferimento de Prazo Comercial', targetId: 'fin-1', targetLabel: 'Asfixia de Giro', description: 'O aumento de prazo de 30 para 60 dias nas vendas de varejo gerou pressão sobre a necessidade de capital de giro.', impactScore: 85 },
    { sourceId: 'fin-1', sourceLabel: 'Asfixia de Giro', targetId: 'liq-1', targetLabel: 'Deterioração de Liquidez', description: 'A necessidade de caixa de curto prazo forçou captação externa, elevando despesa financeira em 12%.', impactScore: 78 }
  ];

  const activeChains = chains.length > 0 ? chains : defaultChains;

  return (
    <div className="card-premium p-8 space-y-6">
      <div>
        <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Network className="w-4 h-4 text-indigo-400" />
          Relações de Causalidade Financeira
        </h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Mapeamento causal de eventos de negócio e seus reflexos na estrutura patrimonial.
        </p>
      </div>

      <div className="space-y-4">
        {activeChains.map((edge, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <div 
              key={idx}
              onClick={() => setSelectedIdx(isSelected ? null : idx)}
              className={`p-5 bg-slate-950/40 border rounded-xl cursor-pointer transition-all ${
                isSelected ? 'border-indigo-500/35 bg-indigo-500/5' : 'border-border/10 hover:border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider bg-slate-900 border border-border/5 px-3 py-1.5 rounded-lg">
                    {edge.sourceLabel}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-250 uppercase tracking-wider bg-slate-900 border border-border/5 px-3 py-1.5 rounded-lg">
                    {edge.targetLabel}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-mono">Impacto Estimado</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                    edge.impactScore >= 80 
                      ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {edge.impactScore}%
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-border/5 space-y-3 animate-in fade-in duration-300">
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {edge.description}
                  </p>
                  <div className="flex justify-end">
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Traceability Active
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
