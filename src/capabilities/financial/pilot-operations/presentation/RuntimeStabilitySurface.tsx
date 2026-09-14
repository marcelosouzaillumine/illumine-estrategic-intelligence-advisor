import React from 'react';
import { usePilotOperations } from '../../../../context/pilot-operations/PilotOperationsProvider';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';
// src/components/pilot-operations/RuntimeStabilitySurface.tsx


export const RuntimeStabilitySurface: React.FC = () => {
  const { runtimeStability, telemetryEvents, pilotStatus } = usePilotOperations();

  const errorsCount = telemetryEvents.filter(e => e.hasError).length;
  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  // Calculate average latency from telemetry
  const durationEvents = telemetryEvents.filter(e => e.durationMs !== undefined);
  const avgLatency = durationEvents.length > 0
    ? Math.round(durationEvents.reduce((acc, curr) => acc + (curr.durationMs || 0), 0) / durationEvents.length)
    : 0;

  return (
    <div className="card-premium p-6 space-y-4 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-3">
        <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase block">RUNTIME STABILITY SURFACE</span>
        <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${
          isFailClosed ? 'text-rose-500 bg-critical-soft0/10 border-rose-500/25' :
          runtimeStability > 95 ? 'text-emerald-500 bg-success-soft0/10 border-emerald-500/25' : 'text-amber-500 bg-warning-soft0/10 border-amber-500/25'
        }`}>
          {isFailClosed ? 'FAIL CLOSED' : `${runtimeStability}% STATUS`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Latency card */}
        <div className="p-3 bg-surface-container/60 border border-border/60 rounded-xl space-y-1">
          <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">AVG LATENCY</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono tracking-tight text-foreground">
              {isFailClosed ? 'N/A' : `${avgLatency}ms`}
            </span>
          </div>
        </div>

        {/* Errors card */}
        <div className="p-3 bg-surface-container/60 border border-border/60 rounded-xl space-y-1">
          <span className="text-[9px] font-mono font-black text-muted-foreground uppercase tracking-widest block">ISOLATION LOGS</span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono tracking-tight ${errorsCount > 0 ? 'text-rose-500' : 'text-foreground'}`}>
              {isFailClosed ? 'RESTRICTED' : `${errorsCount} Err`}
            </span>
          </div>
        </div>
      </div>

      <div className="text-[10px] font-mono text-muted-foreground leading-normal flex items-center gap-1.5 bg-surface-container/30 px-3 py-2 rounded-lg">
        <Cpu size={12} className="shrink-0 text-secondary" />
        <span>Sovereignty state: COMPLIANT · Sandbox: SECURE</span>
      </div>
    </div>
  );
};
