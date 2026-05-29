import React from 'react';
import { InstitutionalCashSignal } from '../../../core/runtime/cash-intelligence/types';
import { cn } from '../../../lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

export function CashConversionStressPanel({ signal }: { signal?: InstitutionalCashSignal }) {
  if (!signal) return null;
  const isHealthy = signal.classification === 'HEALTHY' || signal.classification === 'ATTENTION';
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4", isHealthy ? "bg-blue-50 border-blue-100" : "bg-amber-50 border-amber-100")}>
      <div className="flex items-center gap-3">
        {isHealthy ? <TrendingUp className="text-blue-600" /> : <TrendingDown className="text-amber-600" />}
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
