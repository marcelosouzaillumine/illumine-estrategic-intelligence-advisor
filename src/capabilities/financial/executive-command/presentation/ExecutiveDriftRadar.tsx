import React from 'react';
import { Compass, ShieldAlert, CheckCircle } from 'lucide-react';
import { ExecutiveDriftEvent } from '../../../../services/FiduciaryRuntimeAdapter';
// src/components/executive-command/ExecutiveDriftRadar.tsx


interface ExecutiveDriftRadarProps {
  driftEvents: ExecutiveDriftEvent[];
}

export function ExecutiveDriftRadar({ driftEvents }: ExecutiveDriftRadarProps) {
  if (driftEvents.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono text-center space-y-4 flex flex-col justify-center min-h-[250px]">
        <CheckCircle size={24} className="mx-auto text-emerald-500" />
        <h3 className="text-zinc-300 font-bold tracking-widest uppercase">Executive Drift Clear</h3>
        <p className="text-zinc-500 text-xs">Nenhum desalinhamento estrutural detectado. Ações em harmonia com continuidade.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono w-full">
      <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
        <Compass size={14} />
        Executive Drift Radar
      </h3>
      
      <div className="space-y-4">
        {driftEvents.map(event => {
          const isCritical = event.severity === 'CRITICAL' || event.severity === 'HIGH';
          
          return (
            <div 
              key={event.id} 
              className={`p-4 rounded border ${
                isCritical ? 'bg-red-950/20 border-red-900/40' : 'bg-orange-950/20 border-orange-900/40'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={14} className={isCritical ? 'text-red-400' : 'text-orange-400'} />
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${isCritical ? 'text-red-400' : 'text-orange-400'}`}>
                    Drift Detectado ({event.severity})
                  </span>
                </div>
                <span className="text-[9px] text-zinc-500 font-mono">
                  {event.timestamp.split('T')[1].substring(0, 5)}
                </span>
              </div>
              
              <p className="text-xs text-zinc-300 leading-relaxed">
                {event.description}
              </p>
              
              <div className="mt-3 pt-3 border-t border-zinc-800/50 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-widest">
                  <span className="text-zinc-600 font-bold">Métrica Base:</span>
                  <span className="text-zinc-400">{event.observedMetric}</span>
                </div>
                {event.conflictingDirective && (
                  <div className="flex items-center justify-between text-[9px] uppercase tracking-widest">
                    <span className="text-zinc-600 font-bold">Restrição Afetada:</span>
                    <span className="text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {event.conflictingDirective.substring(0, 16)}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
