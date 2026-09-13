import React from 'react';
import { useCommandCenter } from '../../../../context/governance-command-center/GovernanceCommandCenterProvider';
import { useExecutiveFormatter } from "../../../../core/localization";

export const GovernanceSupervisionTimeline: React.FC = () => {
    const formatter = useExecutiveFormatter();
  const { activeIncidents } = useCommandCenter();

  // Ordenar por data de detecção (mais antiga primeiro para timeline de progressão)
  const timelineItems = [...activeIncidents]
    .map(i => i.incident)
    .sort((a, b) => new Date(a.detectedAt).getTime() - new Date(b.detectedAt).getTime());

  return (
    <div className="p-5 bg-slate-950/70 border border-border rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h4 className="text-muted-foreground font-semibold tracking-wider uppercase text-xs font-mono">
          Supervision Timeline
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          Incident Chronology
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-850">
        {timelineItems.map((inc, idx) => (
          <div key={idx} className="relative group flex items-start gap-3">
            {/* Ponto da Linha do Tempo */}
            <span className="absolute -left-[20px] top-1.5 w-3 h-3 rounded-full bg-slate-950 border-2 border-border group-hover:border-border transition-all flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </span>

            <div className="flex-1 p-3.5 bg-slate-900/30 border border-border rounded-xl hover:border-border transition-all space-y-1">
              <div className="flex justify-between items-center font-mono text-[10px] text-muted-foreground">
                <span>{formatter.date(inc.detectedAt, { hour: '2-digit', minute: '2-digit' })} - {formatter.date(inc.detectedAt)}</span>
                <span className="text-cyan-400 font-bold">{inc.severity}</span>
              </div>
              <h5 className="text-xs font-mono font-bold text-muted-foreground">{inc.title}</h5>
              <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                {inc.description}
              </p>
            </div>
          </div>
        ))}

        {timelineItems.length === 0 && (
          <div className="p-4 bg-slate-900/20 border border-border rounded-xl text-center text-xs text-muted-foreground font-mono">
            SEM HISTÓRICO DE INCIDENTES DETECTADO NESTE HORIZONTE.
          </div>
        )}
      </div>
    </div>
  );
};
