import React from 'react';
import { useCommandCenter } from '../../../../context/governance-command-center/GovernanceCommandCenterProvider';

export const RuntimeHealthPanel: React.FC = () => {
  const {
    runtimeHealth,
    commandIntegrity,
    triggerFailClosedState,
    triggerRecoveryState
  } = useCommandCenter();

  if (!runtimeHealth) {
    return (
      <div className="p-5 bg-slate-950/70 border border-border rounded-xl text-center text-muted-foreground font-mono text-xs">
        CARREGANDO TELEMETRIA DE SAÚDE...
      </div>
    );
  }

  const { status, integrityPercentage, failedLineageCount, telemetryContinuous, hasBrokenPropagation } = runtimeHealth;

  let healthColor = 'text-emerald-400';
  let healthBg = 'bg-emerald-950/20 border-emerald-500/20';

  if (status === 'FAIL_CLOSED') {
    healthColor = 'text-rose-400';
    healthBg = 'bg-rose-950/20 border-rose-500/20';
  } else if (status === 'DEGRADED' || status === 'PARTIAL') {
    healthColor = 'text-amber-400';
    healthBg = 'bg-amber-950/20 border-amber-500/20';
  }

  return (
    <div className="p-6 bg-slate-950/70 border border-border rounded-xl space-y-5">
      <div className="flex justify-between items-center border-b border-border pb-3 flex-wrap gap-2">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground uppercase">GCC TRACER TELEMETRY</span>
          <h3 className="text-sm font-bold text-muted-foreground font-mono mt-0.5">Runtime Health Profile</h3>
        </div>
        <div className={`px-2.5 py-1 rounded border font-mono text-xs ${healthBg} ${healthColor}`}>
          {status}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Integridade do Ledger */}
        <div className="p-3 bg-slate-900/40 border border-border rounded-xl space-y-1">
          <span className="text-[9px] font-mono text-muted-foreground uppercase">LEDGER INTEGRITY</span>
          <div className="text-xl font-bold font-mono text-muted-foreground">{integrityPercentage}%</div>
          <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${status === 'FAIL_CLOSED' ? 'bg-critical-soft0' : integrityPercentage < 80 ? 'bg-warning-soft0' : 'bg-success-soft0'}`}
              style={{ width: `${integrityPercentage}%` }}
            />
          </div>
        </div>

        {/* Telemetria Continuidade */}
        <div className="p-3 bg-slate-900/40 border border-border rounded-xl space-y-1">
          <span className="text-[9px] font-mono text-muted-foreground uppercase">TELEMETRY STREAM</span>
          <div className={`text-xs font-bold font-mono ${telemetryContinuous ? 'text-emerald-400' : 'text-rose-400'}`}>
            {telemetryContinuous ? 'CONTINUOUS' : 'DISCONNECTED'}
          </div>
          <p className="text-[9px] text-muted-foreground leading-none">
            {telemetryContinuous ? 'Tracer heartbeats active.' : 'Continuous sync lost.'}
          </p>
        </div>
      </div>

      {/* Lista de Métricas de Integridade */}
      <div className="space-y-2 text-xs font-mono text-muted-foreground">
        <div className="flex justify-between border-b border-border pb-1">
          <span>Failed Lineage Refs:</span>
          <span className={failedLineageCount > 0 ? 'text-amber-400 font-bold' : 'text-muted-foreground'}>
            {failedLineageCount}
          </span>
        </div>
        <div className="flex justify-between border-b border-border pb-1">
          <span>Broken Propagations:</span>
          <span className={hasBrokenPropagation ? 'text-rose-400 font-bold' : 'text-muted-foreground'}>
            {hasBrokenPropagation ? 'YES' : 'NO'}
          </span>
        </div>
      </div>

      {/* Controles de Trigger (Auditoria e Resiliência) */}
      <div className="pt-2 border-t border-border flex gap-2 flex-wrap">
        <button
          onClick={triggerFailClosedState}
          disabled={status === 'FAIL_CLOSED'}
          className={`flex-1 py-1.5 rounded-lg text-center font-mono text-[10px] font-bold border transition-all active:scale-[0.98] ${
            status === 'FAIL_CLOSED'
              ? 'bg-rose-950/20 text-rose-500 border-rose-500/20 opacity-50 cursor-not-allowed'
              : 'bg-rose-950/20 text-rose-400 border-rose-500/35 hover:bg-rose-950/45 hover:border-rose-400'
          }`}
        >
          FAIL_CLOSED TRIGGER
        </button>

        <button
          onClick={triggerRecoveryState}
          disabled={status !== 'FAIL_CLOSED'}
          className={`flex-1 py-1.5 rounded-lg text-center font-mono text-[10px] font-bold border transition-all active:scale-[0.98] ${
            status !== 'FAIL_CLOSED'
              ? 'bg-emerald-950/20 text-emerald-500 border-emerald-500/20 opacity-50 cursor-not-allowed'
              : 'bg-emerald-950/20 text-emerald-400 border-emerald-500/35 hover:bg-emerald-950/45 hover:border-emerald-400'
          }`}
        >
          RECOVER SYSTEM
        </button>
      </div>
    </div>
  );
};
