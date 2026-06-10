// src/components/operating-pressure/PressurePropagationGraph.tsx

import React from 'react';
import { ArrowRight, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PropagationProps {
  data: {
    propagationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'SYSTEMIC';
    propagationChain: string[];
    activePathways: string[];
  };
}

export function PressurePropagationGraph({ data }: PropagationProps) {
  const steps = [
    { name: 'Margem', key: 'Fadiga de Estrutura' },
    { name: 'Caixa Operacional', key: 'Contágio de Caixa Operacional' },
    { name: 'Liquidez', key: 'Compressão de Liquidez' },
    { name: 'Tesouraria', key: 'Erosão de Tesouraria' },
    { name: 'Funding', key: 'Instabilidade de Funding' },
    { name: 'Governança', key: 'Desgaste Sistêmico de Governança' },
  ];

  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-display font-medium text-foreground">
          Cadeia de Contágio Estrutural
        </h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-surface-container border border-border rounded-full text-xs">
          <Activity size={12} className="text-secondary animate-pulse" />
          <span className="text-muted-foreground">Grau: <span className="font-bold text-foreground">{data.propagationLevel}</span></span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
        {steps.map((step, idx) => {
          const isActive = data.activePathways.includes(step.key);
          return (
            <React.Fragment key={idx}>
              <div className={cn(
                "flex-1 w-full md:w-auto p-4 rounded-xl border text-center transition-all",
                isActive 
                  ? "bg-critical-soft text-destructive border-destructive/20 font-bold" 
                  : "bg-surface-container/50 text-muted-foreground border-border"
              )}>
                <div className="text-[10px] font-black uppercase tracking-wider mb-1">Passo {idx + 1}</div>
                <div className="text-xs">{step.name}</div>
              </div>
              {idx < steps.length - 1 && (
                <ArrowRight className="hidden md:block text-muted-foreground rotate-0 shrink-0" size={16} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {data.propagationChain.length > 0 && (
        <div className="mt-8 bg-surface-container/40 p-4 rounded-2xl border border-border">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Resumo das Propagações Ativas</div>
          <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground">
            {data.propagationChain.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
