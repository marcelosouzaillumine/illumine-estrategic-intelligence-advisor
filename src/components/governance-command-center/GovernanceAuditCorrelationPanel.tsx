import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const GovernanceAuditCorrelationPanel: React.FC = () => {
  const { supervisionEvents, commandIntegrity } = useCommandCenter();

  // Pegar os 3 eventos mais recentes
  const recentEvents = [...supervisionEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Fiduciary Correlation Ledger
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          APPEND-ONLY STREAM
        </span>
      </div>

      <div className="space-y-3">
        {recentEvents.map((evt, idx) => (
          <div key={idx} className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-lg hover:border-slate-700/60 transition-all font-mono text-[10px] space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-cyan-400 font-bold">{evt.supervisionAction} Event</span>
              <span className="text-slate-500">{evt.timestamp}</span>
            </div>
            
            <div className="space-y-1 text-slate-400">
              <div className="flex justify-between">
                <span>CorrelationId:</span>
                <span className="text-slate-200 select-all">{evt.correlationId}</span>
              </div>
              <div className="flex justify-between">
                <span>LineageHash:</span>
                <span className="text-slate-200 select-all truncate max-w-[150px]">{evt.lineageHash}</span>
              </div>
              <div className="flex justify-between">
                <span>Actor ID:</span>
                <span className="text-slate-200">{evt.actorId}</span>
              </div>
              {evt.details && (
                <div className="text-[10px] text-slate-400 border-t border-slate-800/50 pt-1 mt-1 leading-normal italic">
                  Details: {evt.details}
                </div>
              )}
            </div>
          </div>
        ))}

        {recentEvents.length === 0 && (
          <div className="p-4 bg-slate-900/20 border border-slate-850 rounded-xl text-center text-xs text-slate-500 font-mono">
            NENHUM EVENTO DE SUPERVISÃO REGISTRADO NA SESSÃO ATIVA.
          </div>
        )}
      </div>

      {commandIntegrity === 'FAIL_CLOSED' && (
        <div className="p-3 bg-rose-950/20 border border-rose-500/20 rounded-lg flex items-start gap-2.5">
          <span className="text-rose-400 text-sm mt-0.5">🚨</span>
          <p className="text-slate-400 text-[10px] font-mono leading-relaxed">
            <span className="text-rose-400 font-bold">Ledger Suspended</span>: O sistema está em modo FAIL-CLOSED. Gravações de novos logs de auditoria estão bloqueadas.
          </p>
        </div>
      )}
    </div>
  );
};
