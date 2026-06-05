import React from 'react';
import { Gauge, Zap, Activity } from 'lucide-react';
import { RuntimeLatencySnapshot } from '../../services/FiduciaryRuntimeAdapter';

export function RuntimeLatencyPanel({ snapshot }: { snapshot?: RuntimeLatencySnapshot }) {
  if (!snapshot) {
    return (
      <div className="p-6 bg-surface-container border border-border rounded-xl">
        <h3 className="font-medium flex items-center gap-2 text-sm text-muted-foreground"><Gauge size={16}/> Runtime Latency</h3>
        <p className="text-xs text-muted-foreground mt-2">Aguardando execução...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-surface-container border border-border rounded-xl">
      <h3 className="font-medium flex items-center gap-2 text-sm mb-4"><Gauge className="text-primary" size={18}/> Runtime Latency</h3>
      <div className="text-3xl font-bold text-foreground flex items-baseline gap-2">
        {snapshot.totalDurationMs.toFixed(0)}<span className="text-sm font-medium text-muted-foreground">ms</span>
      </div>
      <div className="mt-4 space-y-2">
        {snapshot.stages.map(stage => (
          <div key={stage.stage} className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground flex items-center gap-1"><Activity size={12}/> {stage.stage}</span>
            <span className="font-mono text-foreground">{stage.durationMs.toFixed(1)}ms</span>
          </div>
        ))}
      </div>
      {snapshot.bottlenecks.length > 0 && (
        <div className="mt-4 p-3 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded text-xs">
          <strong>Gargalos Detectados:</strong>
          <ul className="list-disc list-inside mt-1">
            {snapshot.bottlenecks.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
