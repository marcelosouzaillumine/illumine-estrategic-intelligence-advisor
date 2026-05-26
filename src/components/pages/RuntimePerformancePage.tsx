import React, { useState, useEffect } from 'react';
import { Gauge, Cpu, Database } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';
import { RuntimeLatencyPanel } from '../performance/RuntimeLatencyPanel';
import { RuntimeLatencySnapshot } from '../../core/runtime/profiling/ProfilingTypes';

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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Runtime Performance"
        subtitle="Monitoramento Passivo de Latência, Memória e Profiling Multi-Tenant."
        icon={Gauge}
        transparent
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RuntimeLatencyPanel snapshot={snapshot} />

        <div className="card-premium p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
              <Cpu size={16} />
            </div>
            <h3 className="text-h3 font-medium text-foreground tracking-tight">Memory Spikes (RAM)</h3>
          </div>
          {spikes.length === 0 ? (
            <p className="text-body-sm text-muted-foreground font-medium italic">Nenhum pico de memória detectado.</p>
          ) : (
            <div className="space-y-3">
              {spikes.map((s, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 bg-surface-container border border-border rounded-md">
                  <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">{s.action}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{(s.estimatedBytes / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-premium p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-success/10 flex items-center justify-center text-success">
              <Database size={16} />
            </div>
            <h3 className="text-h3 font-medium text-foreground tracking-tight">Query Performance</h3>
          </div>
          {queries.length === 0 ? (
            <p className="text-body-sm text-muted-foreground font-medium italic">Nenhuma query lenta detectada.</p>
          ) : (
            <div className="space-y-2">
              {queries.map((q, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-surface-container border border-border rounded-md">
                  <span className="text-[10px] font-mono text-muted-foreground">{q.collection}</span>
                  <span className={cn(
                    'text-[10px] font-bold font-mono',
                    q.durationMs > 1000 ? 'text-destructive' : 'text-success'
                  )}>{q.durationMs}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
