import React from 'react';
import { usePilotOperations } from '../../context/pilot-operations/PilotOperationsProvider';
import { Clock, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { useExecutiveFormatter } from "../../core/localization";

// src/components/pilot-operations/ExecutiveAdoptionTimeline.tsx


export const ExecutiveAdoptionTimeline: React.FC = () => {
    const formatter = useExecutiveFormatter();
  const { telemetryEvents, pilotStatus } = usePilotOperations();

  const isFailClosed = pilotStatus === 'FAIL_CLOSED';

  // Get last 6 events, sorted reverse chronologically
  const displayedEvents = [...telemetryEvents]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="w-8 h-8 rounded-md bg-secondary/10 flex items-center justify-center text-secondary">
          <Clock size={16} />
        </div>
        <div>
          <h3 className="text-h3 font-medium tracking-tight">Registro de Auditoria de Telemetria</h3>
          <p className="text-body-sm text-muted-foreground mt-0.5">Eventos operacionais capturados com conformidade fiduciária e privacidade.</p>
        </div>
      </div>

      {isFailClosed ? (
        <div className="py-8 text-center bg-surface-container/50 border border-dashed border-border rounded-xl flex flex-col items-center">
          <ShieldAlert size={32} className="text-rose-500 mb-2 animate-bounce" />
          <p className="text-body-sm font-bold text-muted-foreground">Telemetria em Estado Restrito</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1">Exibindo apenas logs de isolamento. Entrada interativa desabilitada.</p>
        </div>
      ) : telemetryEvents.length === 0 ? (
        <p className="text-xs text-muted-foreground italic font-medium">Nenhum evento registrado ainda.</p>
      ) : (
        <div className="relative border-l border-border/60 pl-6 ml-3 space-y-6">
          {displayedEvents.map((event) => (
            <div key={event.eventId} className="relative group/item">
              {/* Dot indicator */}
              <span className={`absolute -left-[30px] top-1 w-2 h-2 rounded-full border transition-all ${
                event.hasError 
                  ? 'bg-critical-soft0 border-rose-500' 
                  : 'bg-secondary border-secondary group-hover/item:scale-125'
              }`} />

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-x-2 text-[10px] font-mono font-bold">
                  <span className={event.hasError ? 'text-rose-500' : 'text-foreground'}>
                    {event.actionType}
                  </span>
                  <span className="text-muted-foreground/40 font-normal">·</span>
                  <span className="text-muted-foreground font-normal">
                    {formatter.date(event.timestamp, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-mono text-muted-foreground">
                  <span>Operador: {event.actorId}</span>
                  {event.durationMs !== undefined && <span>Duração: {event.durationMs}ms</span>}
                  <span className="text-secondary/60 tracking-wider font-semibold">{event.eventId}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
