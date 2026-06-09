import React from 'react';
import { InstitutionalCashSignal } from '../../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../../lib/utils';
import { Hourglass, AlertCircle } from 'lucide-react';

function LiquidityConsumptionTimeline({ signal }: { signal?: InstitutionalCashSignal }) {
  if (!signal) return null;
  const isHealthy = signal.classification === 'HEALTHY' || signal.classification === 'ATTENTION';
  return (
    <div className={cn("p-6 rounded-3xl border flex flex-col gap-4", isHealthy ? "bg-slate-50 border-border" : "bg-orange-50 border-orange-200")}>
      <div className="flex items-center gap-3">
        {isHealthy ? <Hourglass className="text-muted-foreground" /> : <AlertCircle className="text-orange-600" />}
        <h4 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{signal.label}</h4>
      </div>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{signal.narrative}</p>
      <div className="mt-auto pt-4 border-t border-border flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>Confiança: {signal.confidence}</span>
        <span>Runway: {signal.displayValue || signal.value}</span>
      </div>
    </div>
  );
}
