import React from 'react';
import { InstitutionalCashSignal } from '../../../core/runtime/cash-intelligence/types';
import { cn } from '../../../lib/utils';
import { Building, ShieldAlert } from 'lucide-react';

export function OperationalCashResiliencePanel({ signal }: { signal?: InstitutionalCashSignal }) {
  if (!signal) return null;
  const isHealthy = signal.classification === 'HEALTHY' || signal.classification === 'ATTENTION';
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4", isHealthy ? "bg-slate-50 border-slate-200" : "bg-orange-50 border-orange-200")}>
      <div className="flex items-center gap-3">
        {isHealthy ? <Building className="text-slate-600" /> : <ShieldAlert className="text-orange-600" />}
        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">{signal.label || 'Resiliência Operacional'}</h4>
      </div>
      <p className="text-sm font-medium text-slate-700 leading-relaxed">{signal.narrative}</p>
      <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Confiança: {signal.confidence}</span>
        {signal.value !== undefined && <span>Métrica: {signal.displayValue || signal.value}</span>}
      </div>
    </div>
  );
}
