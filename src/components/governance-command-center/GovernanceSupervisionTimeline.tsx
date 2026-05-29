import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const GovernanceSupervisionTimeline: React.FC = () => {
  const { activeIncidents } = useCommandCenter();

  // Ordenar por data de detecção (mais antiga primeiro para timeline de progressão)
  const timelineItems = [...activeIncidents]
    .map(i => i.incident)
    .sort((a, b) => new Date(a.detectedAt).getTime() - new Date(b.detectedAt).getTime());

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Supervision Timeline
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          Incident Chronology
        </span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-850">
        {timelineItems.map((inc, idx) => (
          <div key={idx} className="relative group flex items-start gap-3">
            {/* Ponto da Linha do Tempo */}
            <span className="absolute -left-[20px] top-1.5 w-3 h-3 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-slate-500 transition-all flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            </span>

            <div className="flex-1 p-3.5 bg-slate-900/30 border border-slate-850/80 rounded-xl hover:border-slate-800 transition-all space-y-1">
              <div className="flex justify-between items-center font-mono text-[10px] text-slate-500">
                <span>{new Date(inc.detectedAt).toLocaleTimeString()} - {new Date(inc.detectedAt).toLocaleDateString()}</span>
                <span className="text-cyan-400 font-bold">{inc.severity}</span>
              </div>
              <h5 className="text-xs font-mono font-bold text-slate-200">{inc.title}</h5>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                {inc.description}
              </p>
            </div>
          </div>
        ))}

        {timelineItems.length === 0 && (
          <div className="p-4 bg-slate-900/20 border border-slate-850 rounded-xl text-center text-xs text-slate-500 font-mono">
            SEM HISTÓRICO DE INCIDENTES DETECTADO NESTE HORIZONTE.
          </div>
        )}
      </div>
    </div>
  );
};
