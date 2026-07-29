import React from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
// src/components/operating-pressure/OperationalFatiguePanel.tsx


interface FatiguePanelProps {
  data: {
    fatigueScore: number;
    fatigueLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    operatingAbsorptionRatio: number;
    warnings: any[];
  };
}

export function OperationalFatiguePanel({ data }: FatiguePanelProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-medium text-foreground">
            Fadiga Operacional
          </h3>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
            data.fatigueLevel === 'CRITICAL' ? 'bg-critical-soft text-destructive border-destructive/20' :
            data.fatigueLevel === 'HIGH' ? 'bg-warning-soft0/10 text-amber-500 border-amber-500/20' :
            data.fatigueLevel === 'MEDIUM' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
            'bg-success-soft0/10 text-emerald-500 border-emerald-500/20'
          )}>
            Nível: {data.fatigueLevel}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-display font-bold text-foreground">
            {data.fatigueScore.toFixed(0)}
          </span>
          <span className="text-muted-foreground text-sm">/ 100</span>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Mede a capacidade de conversão da margem operacional (EBITDA) frente à eficiência dos custos fixos.
        </p>

        {data.warnings.length > 0 ? (
          <div className="space-y-3">
            {data.warnings.map((w: any, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-muted-foreground items-start">
                <ShieldAlert size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{typeof w === 'string' ? w : t(w.labelKey, w.args)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 text-xs text-emerald-500 items-center">
            <CheckCircle size={14} className="shrink-0" />
            <span>Nenhum alerta de overhead ou ineficiência no ciclo.</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">Índice de Conversão EBITDA/Bruto:</span>
        <span className="font-bold text-foreground">{(data.operatingAbsorptionRatio * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}
