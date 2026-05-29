import React from 'react';
import { InstitutionalCashSignal } from '../../../core/runtime/cash-intelligence/types';
import { cn } from '../../../lib/utils';
import { ShieldAlert, ShieldCheck, Activity } from 'lucide-react';

export function InstitutionalCashIntegrityPanel({ signal }: { signal?: InstitutionalCashSignal }) {
  if (!signal) return null;
  const isHealthy = signal.classification === 'HEALTHY' || signal.classification === 'ATTENTION';
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4", isHealthy ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100")}>
      <div className="flex items-center gap-3">
        {isHealthy ? <ShieldCheck className="text-emerald-600" /> : <ShieldAlert className="text-rose-600" />}
        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">{signal.label}</h4>
      </div>
      <p className="text-sm font-medium text-slate-700 leading-relaxed">{signal.narrative}</p>
      <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Confiança: {signal.confidence}</span>
        <span>Valor: {signal.displayValue || signal.value}</span>
      </div>
    </div>
  );
}
