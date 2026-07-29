import React from 'react';
import { TreasurySurvivalProfile } from '../../services/FiduciaryRuntimeAdapter';
// src/components/war-gaming/LiquidityStressTimeline.tsx


export function LiquidityStressTimeline({ treasury }: { treasury: TreasurySurvivalProfile }) {
  if (!treasury) return null;

  const runway = treasury.availableRunwayMonths;
  const maxSimulated = 24;
  const percentage = Math.min(100, (runway / maxSimulated) * 100);

  return (
    <div className="bg-white border border-border p-6 rounded-3xl h-full flex flex-col justify-center">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Horizonte de Liquidez</h3>
      
      <div className="relative w-full h-8 bg-slate-100 rounded-full overflow-hidden border border-border">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ${treasury.exhaustionPointReached ? 'bg-critical-soft0' : 'bg-success-soft0'}`}
          style={{ width: `${percentage}%` }}
        ></div>
        
        {/* Markers */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-white/50"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-white/50"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-white/50"></div>
      </div>

      <div className="flex justify-between mt-2 text-[9px] font-bold text-muted-foreground uppercase">
        <span>0</span>
        <span>6m</span>
        <span>12m</span>
        <span>18m</span>
        <span>24m+</span>
      </div>
    </div>
  );
}
