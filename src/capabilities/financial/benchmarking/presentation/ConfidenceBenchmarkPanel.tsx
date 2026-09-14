import React from 'react';
import { BenchmarkConfidenceSignal } from '../../../../services/FiduciaryRuntimeAdapter';

export function ConfidenceBenchmarkPanel({ distribution }: { distribution: Record<BenchmarkConfidenceSignal, number> }) {
  if (!distribution) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded bg-surface-container border border-border">
        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">High</div>
        <div className="text-xl font-light text-emerald-500">{distribution.HIGH}%</div>
      </div>
      <div className="p-4 rounded bg-surface-container border border-border">
        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Medium</div>
        <div className="text-xl font-light text-amber-500">{distribution.MEDIUM}%</div>
      </div>
      <div className="p-4 rounded bg-surface-container border border-border">
        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Low</div>
        <div className="text-xl font-light text-orange-500">{distribution.LOW}%</div>
      </div>
      <div className="p-4 rounded bg-surface-container border border-border">
        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Critical</div>
        <div className="text-xl font-light text-rose-500">{distribution.CRITICAL}%</div>
      </div>
    </div>
  );
}
