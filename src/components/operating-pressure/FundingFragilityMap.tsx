// src/components/operating-pressure/FundingFragilityMap.tsx

import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';

interface FundingFragilityProps {
  data: {
    fragilityScore: number;
    fundingDependency: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
    rolloverPressureRatio: number;
    rolloverRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    warnings: any[];
  };
}

export function FundingFragilityMap({ data }: FundingFragilityProps) {
  const { t } = useLanguage();
  return (
    <div className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-medium text-foreground">
            Fragilidade de Funding
          </h3>
          <span className={cn(
            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
            data.rolloverRiskLevel === 'CRITICAL' ? 'bg-destructive/10 text-destructive border-destructive/20' :
            data.rolloverRiskLevel === 'HIGH' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
            data.rolloverRiskLevel === 'MEDIUM' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
            'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
          )}>
            Rollover: {data.rolloverRiskLevel}
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-display font-bold text-foreground">
            {data.fragilityScore.toFixed(0)}
          </span>
          <span className="text-muted-foreground text-sm">/ 100</span>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Avalia o grau de dependência de recursos externos e a pressão de rolagem das dívidas corporativas de curto prazo.
        </p>

        {data.warnings.length > 0 ? (
          <div className="space-y-3">
            {data.warnings.map((w: any, idx) => (
              <div key={idx} className="flex gap-2 text-xs text-muted-foreground items-start">
                <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                <span>{typeof w === 'string' ? w : t(w.labelKey, w.args)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 text-xs text-emerald-500 items-center">
            <CheckCircle size={14} className="shrink-0" />
            <span>Estrutura de capital sem passivos onerosos relevantes.</span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs">
        <span className="text-muted-foreground font-medium">Dependência de Funding:</span>
        <span className="font-bold text-foreground">{data.fundingDependency}</span>
      </div>
    </div>
  );
}
