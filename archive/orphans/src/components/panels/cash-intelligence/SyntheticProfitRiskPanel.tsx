import React from 'react';
import { InstitutionalCashSignal } from '../../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../../lib/utils';
import { ZapOff, Zap } from 'lucide-react';

export function SyntheticProfitRiskPanel({ signal }: { signal?: InstitutionalCashSignal }) {
  if (!signal) return null;
  const isHealthy = signal.classification === 'HEALTHY' || signal.classification === 'ATTENTION';
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4", isHealthy ? "bg-emerald-50 border-emerald-100" : "bg-primary border-primary")}>
      <div className="flex items-center gap-3">
        {isHealthy ? <Zap className="text-emerald-600" /> : <ZapOff className="text-primary" />}
        <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">{signal.label}</h4>
      </div>
      <p className="text-sm font-medium text-slate-700 leading-relaxed">{signal.narrative}</p>
      <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span>Confiança: {signal.confidence}</span>
        {signal.value !== undefined && <span>Métrica: {signal.displayValue || signal.value}</span>}
      </div>
    </div>
  );
}
