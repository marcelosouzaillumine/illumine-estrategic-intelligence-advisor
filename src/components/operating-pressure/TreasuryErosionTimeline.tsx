// src/components/operating-pressure/TreasuryErosionTimeline.tsx

import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface TreasuryErosionProps {
  data: {
    erosionScore: number;
    drainVelocity: number;
    erosionState: 'STABLE' | 'MODERATE' | 'ERODING' | 'CRITICAL_EROSION';
    warnings: any[];
  };
}

export function TreasuryErosionTimeline({ data }: TreasuryErosionProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-medium text-foreground">
            Erosão de Tesouraria
          </h3>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
            data.erosionState === 'CRITICAL_EROSION' ? 'bg-destructive/10 text-destructive border-destructive/20' :
            data.erosionState === 'ERODING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
            data.erosionState === 'MODERATE' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
            'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          )}>
            Estado: {data.erosionState}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-display font-bold text-foreground">
            {data.erosionScore.toFixed(0)}
          </span>
          <span className="text-muted-foreground text-sm">/ 100</span>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Mede a taxa de consumo das reservas líquidas de caixa operacional e o encolhimento do runway.
        </p>

        {data.warnings.length > 0 ? (
          <div className="space-y-3">
            {data.warnings.map((w: any, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-muted-foreground items-start">
                <AlertCircle size={14} className="text-destructive shrink-0 mt-0.5" />
                <span>{typeof w === 'string' ? w : t(w.labelKey, w.args)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 text-xs text-emerald-500 items-center">
            <CheckCircle size={14} className="shrink-0" />
            <span>Preservação total de reservas de tesouraria.</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">Velocidade de Drenagem:</span>
        <span className="font-bold text-foreground">{(data.drainVelocity * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
