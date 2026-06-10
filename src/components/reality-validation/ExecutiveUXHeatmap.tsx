import React from 'react';
import { ScanEye } from 'lucide-react';
import { ExecutiveAttentionMapper } from '../../services/FiduciaryRuntimeAdapter';

export function ExecutiveUXHeatmap() {
  const entries = ExecutiveAttentionMapper.mapForCFO();

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ScanEye className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Executive Attention Heatmap (CFO)</h3>
      </div>
      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-foreground font-medium">{entry.section}</span>
              <div className="flex gap-3">
                <span className="text-muted-foreground">Priority: <span className="text-primary font-bold">{(entry.priorityWeight * 100).toFixed(0)}%</span></span>
                <span className="text-muted-foreground">Load: <span className={entry.cognitiveLoad > 0.6 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>{(entry.cognitiveLoad * 100).toFixed(0)}%</span></span>
              </div>
            </div>
            <div className="relative h-2 bg-border/50 rounded overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-primary/70 rounded"
                style={{ width: `${entry.priorityWeight * 100}%` }}
              />
              <div
                className="absolute left-0 top-0 h-full bg-critical-soft0/40 rounded"
                style={{ width: `${entry.cognitiveLoad * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-primary/70 rounded inline-block" /> Prioridade</span>
        <span className="flex items-center gap-1"><span className="w-3 h-2 bg-critical-soft0/40 rounded inline-block" /> Carga Cognitiva</span>
      </div>
    </div>
  );
}
