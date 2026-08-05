import React from 'react';
import { useInstitutionalMemory } from '../../context/institutional-memory/InstitutionalMemoryProvider';
import { Clock, ShieldAlert, Fingerprint, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useExecutiveFormatter } from "../../core/localization";

export function InstitutionalMemoryTimeline() {
    const formatter = useExecutiveFormatter();
  const { memoryTimeline, lineageIntegrity } = useInstitutionalMemory();

  if (lineageIntegrity === 'FAIL_CLOSED') {
    return (
      <div className="card-premium p-8 border border-red-500/35 bg-red-500/5 text-red-400 space-y-3 leading-relaxed rounded-xl">
        <ShieldAlert className="w-6 h-6 animate-pulse" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Histórico Longitudinal Bloqueado (Fail-Closed)</h3>
        <p className="text-xs text-muted-foreground font-medium">
          A integridade de lineage histórico de governança falhou ou está ausente. O sistema bloqueou a exibição da linha do tempo para preservar a soberania das evidências.
        </p>
      </div>
    );
  }

  if (memoryTimeline.length === 0) {
    return (
      <div className="card-premium p-6 text-center italic text-muted-foreground text-xs border-dashed">
        Nenhum evento registrado no histórico longitudinal de governança fiduciária.
      </div>
    );
  }

  return (
    <div className="card-premium p-8 bg-card/45 border border-border/60 space-y-6 animate-executive-fade leading-relaxed">
      <div className="flex items-center gap-3 pb-4 border-b border-border/40">
        <Clock className="w-5 h-5 text-secondary" />
        <div>
          <h3 className="text-h3 font-display font-medium text-foreground tracking-tight">Cronologia de Governança</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Histórico longitudinal de resoluções de conselho</p>
        </div>
      </div>

      <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/60">
        {memoryTimeline.map((phase, idx) => (
          <div key={idx} className="relative group space-y-2">
            <div className={cn(
              "absolute left-[-25px] top-1.5 w-3.5 h-3.5 rounded-full border bg-background flex items-center justify-center transition-transform group-hover:scale-110",
              phase.isFiduciary ? "border-rose-500 bg-critical-soft0/10 text-rose-500" : "border-secondary bg-secondary/10 text-secondary"
            )}>
              <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
            </div>

            <div className="flex items-center gap-2 text-[9px] font-bold tracking-wider uppercase text-muted-foreground">
              <span>{formatter.date(phase.timestamp)}</span>
              <span>•</span>
              <span className="text-foreground font-mono">{phase.category}</span>
              <span>•</span>
              <span className={cn(phase.isFiduciary ? "text-rose-400" : "text-secondary")}>
                {phase.severity}
              </span>
            </div>

            <h4 className="text-xs font-semibold text-foreground leading-normal">{phase.title}</h4>
            <p className="text-xs text-muted-foreground font-medium leading-relaxed">{phase.summary}</p>

            <div className="pt-2 flex items-center gap-4 text-[10px] text-muted-foreground/60 font-semibold font-mono">
              <span className="flex items-center gap-1">
                <Fingerprint size={10} />
                Lineage: {phase.lineageHash}
              </span>
              <span>Runtime ID: {phase.runtimeId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
