// src/components/war-gaming/TreasurySurvivalMap.tsx

import React from 'react';
import { TreasurySurvivalProfile } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';

export function TreasurySurvivalMap({ treasury }: { treasury: TreasurySurvivalProfile }) {
  const isCritical = treasury.exhaustionPointReached;

  return (
    <div className={cn(
      "border p-6 rounded-3xl transition-all",
      isCritical ? "bg-critical-soft/10 border-rose-200" : "bg-success-soft/10 border-emerald-200"
    )}>
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Treasury Survival Map</h3>
      <div className="flex items-end gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Runway Projetado</span>
          <span className={cn(
            "text-4xl font-black tracking-tighter",
            isCritical ? "text-rose-600" : "text-emerald-600"
          )}>
            {treasury.availableRunwayMonths} <span className="text-xl text-muted-foreground font-medium">meses</span>
          </span>
        </div>
        <div className="flex-1 ml-4 border-l border-border pl-4">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Dreno Mensal Simul.</span>
          <p className="text-lg font-black text-muted-foreground tracking-tight">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(treasury.liquidityDrainVelocity)}
          </p>
        </div>
      </div>
      
      {treasury.criticalCovenantBreached && (
        <div className="mt-4 p-3 bg-warning-soft border border-amber-200 rounded-lg flex items-center gap-2">
          <span className="text-amber-500 text-sm">⚠</span>
          <span className="text-xs font-bold text-amber-700 uppercase">Rompimento Projetado de Covenants</span>
        </div>
      )}
    </div>
  );
}
