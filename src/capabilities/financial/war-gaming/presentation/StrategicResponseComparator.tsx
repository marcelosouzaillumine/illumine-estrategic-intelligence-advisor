import React from 'react';
import { WarGameResult } from '../../../../services/FiduciaryRuntimeAdapter';
// src/components/war-gaming/StrategicResponseComparator.tsx


export function StrategicResponseComparator({ result }: { result: WarGameResult }) {
  if (!result) return null;

  return (
    <div className="bg-white border border-border p-6 rounded-3xl">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 border-b border-border pb-2">Comparador de Resposta Estratégica</h3>
      <div className="flex items-center justify-center h-32 bg-slate-50 rounded-xl border border-border border-dashed">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Comparador em construção (Módulo Futuro)</span>
      </div>
    </div>
  );
}
