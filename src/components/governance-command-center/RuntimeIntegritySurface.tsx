import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const RuntimeIntegritySurface: React.FC = () => {
  const { runtimeHealth, commandIntegrity } = useCommandCenter();

  const logs = [
    { time: '12:02:18', level: 'INFO', msg: 'Systemic sovereignty check completed. All entity context resolved.' },
    { time: '12:02:19', level: 'DEBUG', msg: 'Resolving active workspace index references...' },
    { time: '12:02:20', level: 'INFO', msg: 'Firestore rules initialized. Cross-tenant reads rejected by secure boundary.' },
    { time: '12:02:21', level: 'TRACE', msg: 'Tenant context synchronized: tenantId=default-tenant, activeGroupId=GROUP-DEMO-01' },
    {
      time: '12:02:22',
      level: commandIntegrity === 'FAIL_CLOSED' ? 'ERROR' : 'INFO',
      msg: commandIntegrity === 'FAIL_CLOSED' 
        ? 'FAIL_CLOSED TRIGGERED: Vital audit trace parameters missing or compromised.'
        : 'Fiduciary Lineage integrity check passed. Hashes match active ledger.'
    }
  ];

  return (
    <div className="p-5 bg-slate-950/70 border border-border rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h4 className="text-muted-foreground font-semibold tracking-wider uppercase text-xs font-mono">
          Runtime Trace Console
        </h4>
        <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${commandIntegrity === 'FAIL_CLOSED' ? 'bg-rose-950/20 text-rose-400 border border-rose-500/20 animate-pulse' : 'bg-slate-900 text-muted-foreground'}`}>
          {commandIntegrity === 'FAIL_CLOSED' ? 'FAIL-CLOSED SYSTEM LOCK' : 'ACTIVE LISTENER'}
        </span>
      </div>

      <div className="bg-slate-900 border border-border rounded-lg p-3 font-mono text-[10px] space-y-2 max-h-[160px] overflow-y-auto">
        {logs.map((log, idx) => {
          let levelColor = 'text-muted-foreground';
          if (log.level === 'INFO') levelColor = 'text-cyan-400';
          else if (log.level === 'ERROR') levelColor = 'text-rose-400';
          else if (log.level === 'TRACE') levelColor = 'text-emerald-400';

          return (
            <div key={idx} className="flex items-start gap-2 hover:bg-slate-850/50 p-1 rounded transition-all">
              <span className="text-muted-foreground flex-shrink-0">{log.time}</span>
              <span className={`font-bold ${levelColor} flex-shrink-0`}>[{log.level}]</span>
              <span className="text-muted-foreground leading-relaxed">{log.msg}</span>
            </div>
          );
        })}
      </div>

      {runtimeHealth && (
        <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
          <span>Last Trace Time: {runtimeHealth.lastTraceTime}</span>
          <span>Buffer: Continuous</span>
        </div>
      )}
    </div>
  );
};
