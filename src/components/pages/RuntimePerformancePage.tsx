import React, { useState, useEffect } from 'react';
import { Gauge, Cpu, Database, Activity } from 'lucide-react';
import { RuntimeLatencyPanel } from '../performance/RuntimeLatencyPanel';
import { RuntimeProfiler } from '../../core/runtime/profiling/RuntimeProfiler';
import { RuntimeLatencySnapshot } from '../../core/runtime/profiling/ProfilingTypes';
import { RuntimeMemoryTracker } from '../../core/runtime/profiling/RuntimeMemoryTracker';
import { QueryPerformanceTracker } from '../../core/runtime/profiling/QueryPerformanceTracker';

export function RuntimePerformancePage() {
  const [snapshot, setSnapshot] = useState<RuntimeLatencySnapshot | undefined>();
  const [spikes, setSpikes] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);

  useEffect(() => {
    // Onde ainda não houver runtime real, usar EmptyState institucional, não mock.
    setSnapshot(undefined);
    setSpikes([]);
    setQueries([]);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in bg-background min-h-screen">
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <Gauge className="text-primary" />
          Runtime Performance
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Monitoramento Passivo de Latência, Memória e Profiling Multi-Tenant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RuntimeLatencyPanel snapshot={snapshot} />

        <div className="p-6 bg-surface-container border border-border rounded-xl">
          <h3 className="font-medium flex items-center gap-2 text-sm mb-4"><Cpu className="text-secondary" size={18}/> Memory Spikes (RAM)</h3>
          {spikes.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhum pico de memória detectado.</p>
          ) : (
            <div className="space-y-3">
              {spikes.map((s, i) => (
                <div key={i} className="flex flex-col text-xs bg-background border border-border p-2 rounded">
                  <span className="font-semibold text-foreground">{s.action}</span>
                  <span className="text-muted-foreground">{(s.estimatedBytes / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-surface-container border border-border rounded-xl">
          <h3 className="font-medium flex items-center gap-2 text-sm mb-4"><Database className="text-emerald-500" size={18}/> Query Performance</h3>
          {queries.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma query lenta detectada.</p>
          ) : (
            <div className="space-y-3">
              {queries.map((q, i) => (
                <div key={i} className="flex justify-between items-center text-xs bg-background border border-border p-2 rounded">
                  <span className="font-mono text-muted-foreground">{q.collection}</span>
                  <span className={`font-medium ${q.durationMs > 1000 ? 'text-rose-500' : 'text-emerald-500'}`}>{q.durationMs}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
