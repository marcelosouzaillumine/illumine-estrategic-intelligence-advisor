import React from 'react';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

export interface LiquidityRiskWidgetProps {
  risk: 'low' | 'medium' | 'high';
  runwayDays: number;
}

export function LiquidityRiskWidget({ risk, runwayDays }: LiquidityRiskWidgetProps) {
  const Icon = risk === 'low' ? ShieldCheck : risk === 'high' ? ShieldAlert : Shield;
  const riskColor = risk === 'low' ? 'text-emerald-500' : risk === 'high' ? 'text-rose-500' : 'text-amber-500';

  return (
    <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-full flex flex-col justify-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Risco de Liquidez</h3>
      <div className="flex items-center gap-3 mt-2">
        <Icon size={24} className={riskColor} />
        <span className="text-xl font-bold text-foreground uppercase tracking-wide">
          {risk === 'low' ? 'Baixo' : risk === 'high' ? 'Alto' : 'Médio'}
        </span>
      </div>
      <div className="mt-3 text-sm text-muted-foreground">
        Runway projetado de <strong className="text-foreground">{runwayDays} dias</strong>
      </div>
    </div>
  );
}
