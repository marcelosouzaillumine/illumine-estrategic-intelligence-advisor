// src/components/operating-pressure/PressureExplainabilityDrawer.tsx

import React, { useState } from 'react';
import { Eye, Info, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ExplainabilityProps {
  data: {
    pressureLineage: string;
    structuralRationale: string;
    strainDecomposition: {
      engine: string;
      contribution: number;
      rationale: string;
    }[];
    propagationExplanation: string;
    confidenceDecomposition: string;
  };
  lineageHash: string;
}

export function PressureExplainabilityDrawer({ data, lineageHash }: ExplainabilityProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-display font-medium text-foreground">
            Linhagem & Decomposição Fiduciária
          </h3>
          <p className="text-xs text-muted-foreground font-medium">
            Rastreabilidade computacional dos pesos e inputs analíticos.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-surface-container hover:bg-surface-container-high border border-border rounded-xl text-xs text-foreground font-bold transition-all"
        >
          <Eye size={14} />
          {isOpen ? 'Ocultar Detalhes' : 'Ver Detalhes'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-8 pt-6 border-t border-border space-y-6 animate-executive-fade">
          <div className="bg-surface-container/30 p-4 rounded-xl border border-border">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">
              Raciocínio Estrutural
            </span>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              {data.structuralRationale}
            </p>
          </div>

          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
              Decomposição da Nota
            </span>
            <div className="space-y-3">
              {data.strainDecomposition.map((item, idx) => (
                <div key={idx} className="bg-surface-container/10 p-3 rounded-lg border border-border/60 flex items-center justify-between text-xs gap-4">
                  <div className="space-y-0.5">
                    <div className="font-bold text-foreground">{item.engine}</div>
                    <div className="text-muted-foreground text-[11px]">{item.rationale}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-foreground">+{item.contribution.toFixed(1)}</span>
                    <span className="text-muted-foreground text-[10px] block">peso</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container/10 p-4 rounded-xl border border-border/60">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Explicação de Propagação
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.propagationExplanation}
              </p>
            </div>
            <div className="bg-surface-container/10 p-4 rounded-xl border border-border/60">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">
                Metodologia de Confiança
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.confidenceDecomposition}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-xl">
            <Check size={16} className="text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 block">Lineage Hash Consolidado</span>
              <span className="font-mono text-[10px] text-muted-foreground truncate block">{lineageHash}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
