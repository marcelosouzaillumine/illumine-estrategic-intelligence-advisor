import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';
import { useExecutiveFormatter } from '../../core/localization';

export const IncidentLifecyclePanel: React.FC = () => {
  const { selectedIncident, supervisionEvents, activeIncidents } = useCommandCenter();
  const formatter = useExecutiveFormatter();

  if (!selectedIncident) {
    return (
      <div className="p-5 bg-slate-950/70 border border-border rounded-xl text-center text-muted-foreground font-mono text-xs">
        SELECIONE UM INCIDENTE PARA VER SEU CICLO DE VIDA...
      </div>
    );
  }

  // Achar o status atual derived do incidente
  const activeWrapper = activeIncidents.find(i => i.incident.incidentId === selectedIncident.incidentId);
  const currentStatus = activeWrapper ? activeWrapper.currentStatus : 'OPEN';

  // Filtrar eventos deste incidente
  const incidentEvents = supervisionEvents
    .filter(e => e.incidentId === selectedIncident.incidentId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="p-5 bg-slate-950/70 border border-border rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h4 className="text-muted-foreground font-semibold tracking-wider uppercase text-xs font-mono">
          Incident Lifecycle Logs
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          Audit Trail
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Registro Inicial */}
        <div className="p-3 bg-slate-900/40 border border-border rounded-lg space-y-1">
          <div className="flex justify-between text-muted-foreground text-[10px]">
            <span>SYSTEM DETECTION</span>
            <span>{formatter.date(selectedIncident.detectedAt)}</span>
          </div>
          <p className="text-emerald-450 font-bold">DETECTION TRIGGERED</p>
          <p className="text-muted-foreground text-[11px] leading-relaxed font-sans">
            Incidente de tipo {selectedIncident.type} detectado autonomamente pelo Runtime.
          </p>
        </div>

        {/* Histórico de Eventos */}
        {incidentEvents.map((evt, idx) => (
          <div key={idx} className="p-3 bg-slate-900/40 border border-border rounded-lg space-y-1">
            <div className="flex justify-between text-muted-foreground text-[10px]">
              <span>SUPERVISION LOG</span>
              <span>{formatter.date(evt.timestamp)}</span>
            </div>
            <p className="text-cyan-400 font-bold">ACTION: {evt.supervisionAction}</p>
            <p className="text-muted-foreground text-[11px] font-sans">
              {evt.details || 'Ação de supervisão sem observações adicionais.'}
            </p>
            <div className="text-[9px] text-muted-foreground">Actor: {evt.actorId}</div>
          </div>
        ))}

        {incidentEvents.length === 0 && currentStatus !== 'FAIL_CLOSED' && (
          <div className="p-3 bg-slate-900/10 border border-dashed border-border rounded-lg text-center text-muted-foreground text-[11px]">
            Nenhum evento de supervisão registrado para este incidente. Aguardando Acknowledge ou Resolução.
          </div>
        )}
        
        {currentStatus === 'FAIL_CLOSED' && (
          <div className="p-3 bg-rose-950/20 border border-rose-500/25 rounded-lg text-center text-[11px] text-rose-450 animate-pulse">
            SISTEMA EM LOCKDOWN FAIL_CLOSED. AÇÕES BLOQUEADAS.
          </div>
        )}
      </div>
    </div>
  );
};
