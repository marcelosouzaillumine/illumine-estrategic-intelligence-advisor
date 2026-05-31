// src/components/strategic-intelligence/InstitutionalVectorMap.tsx

import React from 'react';
import { Compass } from 'lucide-react';
import { InstitutionalVector } from '../../core/runtime/strategic-intelligence/strategic-intelligence-types';

interface InstitutionalVectorMapProps {
  vector: InstitutionalVector;
}

export function InstitutionalVectorMap({ vector }: InstitutionalVectorMapProps) {
  
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg font-mono h-full flex flex-col">
      <h3 className="text-zinc-400 text-[10px] font-bold tracking-widest uppercase mb-6 flex items-center gap-2">
        <Compass size={14} /> Institutional Vector
      </h3>

      <div className="flex-1 space-y-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Primary Direction</span>
          <span className="text-lg font-bold text-zinc-200 uppercase tracking-widest">
            {vector.direction.replace(/_/g, ' ')}
          </span>
          <p className="text-xs text-zinc-400 mt-2 font-semibold">
            {vector.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 border border-zinc-800/80 p-3 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Persistence</span>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${vector.vectorPersistence * 100}%` }} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 mt-1 block">{(vector.vectorPersistence * 100).toFixed(0)}%</span>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800/80 p-3 rounded">
            <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block mb-2">Stability</span>
            <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${vector.vectorStability * 100}%` }} />
            </div>
            <span className="text-[10px] font-bold text-zinc-400 mt-1 block">{(vector.vectorStability * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
