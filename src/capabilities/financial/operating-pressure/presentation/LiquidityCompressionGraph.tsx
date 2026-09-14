import React from 'react';
import { ArrowDownCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../../../lib/utils';
// src/components/operating-pressure/LiquidityCompressionGraph.tsx


interface LiquidityCompressionProps {
  data: {
    compressionScore: number;
    deteriorationVelocity: number;
    compressionState: 'NORMAL' | 'WARNING' | 'COMPRESSED';
    strainFactors: string[];
  };
}

export function LiquidityCompressionGraph({ data }: LiquidityCompressionProps) {
  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-medium text-foreground">
            Compressão de Liquidez
          </h3>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
            data.compressionState === 'COMPRESSED' ? 'bg-critical-soft text-destructive border-destructive/20' :
            data.compressionState === 'WARNING' ? 'bg-warning-soft0/10 text-amber-500 border-amber-500/20' :
            'bg-success-soft0/10 text-emerald-500 border-emerald-500/20'
          )}>
            Estado: {data.compressionState}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-display font-bold text-foreground">
            {data.compressionScore.toFixed(0)}
          </span>
          <span className="text-muted-foreground text-sm">/ 100</span>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Indica a velocidade e intensidade da contração de caixa disponível contra obrigações correntes de curto prazo.
        </p>

        {data.strainFactors.length > 0 ? (
          <div className="space-y-3">
            {data.strainFactors.map((f, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-muted-foreground items-start">
                <ArrowDownCircle size={14} className="text-destructive shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 text-xs text-emerald-500 items-center">
            <CheckCircle size={14} className="shrink-0" />
            <span>Fluxos de caixa e liquidez no balanço em estabilidade.</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">Velocidade de Contração:</span>
        <span className="font-bold text-foreground">{(data.deteriorationVelocity * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}
