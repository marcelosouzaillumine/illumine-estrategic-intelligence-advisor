import React from 'react';
import { Target, AlertTriangle } from 'lucide-react';
import { InstitutionalDependencyRisk } from '../../../../services/FiduciaryRuntimeAdapter';
// src/components/operational-governance/InstitutionalDependencyRadar.tsx


interface InstitutionalDependencyRadarProps {
  dependencies: InstitutionalDependencyRisk[];
}

export function InstitutionalDependencyRadar({ dependencies }: InstitutionalDependencyRadarProps) {
  
  if (dependencies.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono flex flex-col items-center justify-center min-h-[150px]">
        <Target size={24} className="text-zinc-700 mb-3" />
        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest text-center">
          Nenhuma dependência estrutural ativa
        </span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono">
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
        <Target size={14} /> Dependency Radar
      </h3>

      <div className="space-y-3">
        {dependencies.map(dep => {
          const isCritical = dep.severity === 'CRITICAL';
          return (
            <div key={dep.id} className={`p-3 rounded border ${isCritical ? 'bg-red-950/20 border-red-900/40' : 'bg-orange-950/20 border-orange-900/40'}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={12} className={isCritical ? 'text-red-500' : 'text-orange-500'} />
                <span className={`text-[9px] uppercase font-bold tracking-widest ${isCritical ? 'text-red-400' : 'text-orange-400'}`}>
                  {dep.category.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed font-semibold">
                {dep.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
