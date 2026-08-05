import React from 'react';
import { useInstitutionalMemory } from '../../context/institutional-memory/InstitutionalMemoryProvider';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useExecutiveFormatter } from "../../core/localization";

export function GovernanceRecurrencePanel() {
    const formatter = useExecutiveFormatter();
  const { recurrenceSignals, lineageIntegrity } = useInstitutionalMemory();

  if (lineageIntegrity === 'FAIL_CLOSED' || recurrenceSignals.length === 0) {
    return null;
  }

  // Filter signals to find repeating cycles (RECURRING, CHRONIC, SYSTEMIC)
  const repeatingSignals = recurrenceSignals.filter(
    s => s.recurrence === 'RECURRING' || s.recurrence === 'CHRONIC' || s.recurrence === 'SYSTEMIC'
  );

  return (
    <div className="card-premium p-8 bg-card/45 border border-border/60 space-y-6 animate-executive-fade leading-relaxed">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning-soft0/10 text-amber-500 rounded-lg">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className="text-h3 font-display font-medium text-foreground tracking-tight">Recorrências de Risco e Alertas</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Identificação longitudinal de padrões cíclicos de governança</p>
          </div>
        </div>
      </div>

      {repeatingSignals.length === 0 ? (
        <div className="p-5 border border-emerald-500/20 bg-success-soft0/5 text-emerald-400 text-xs rounded-xl flex items-center gap-3 font-semibold">
          <ShieldCheck size={16} />
          <span>Zero anomalias com padrões recorrentes ou sistêmicos no período vigente.</span>
        </div>
      ) : (
        <div className="space-y-4">
          {repeatingSignals.map((signal, idx) => (
            <div 
              key={idx} 
              className={cn(
                "p-4 border rounded-xl flex justify-between items-start gap-4 transition-all hover:bg-surface-container/20",
                signal.recurrence === 'SYSTEMIC' || signal.recurrence === 'CHRONIC'
                  ? "bg-critical-soft0/[0.02] border-rose-500/25"
                  : "bg-surface-container/20 border-border/40"
              )}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border",
                    signal.recurrence === 'SYSTEMIC' 
                      ? "bg-critical-soft0/10 text-rose-500 border-rose-500/20"
                      : "bg-warning-soft0/10 text-amber-500 border-amber-500/20"
                  )}>
                    {signal.recurrence}
                  </span>
                  <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                    {signal.patternType.replace(/_/g, ' ')}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-foreground mt-1">
                  Ciclo Cíclico Identificado: {signal.frequencyCount} ocorrências registradas
                </h4>
                <p className="text-xs text-muted-foreground font-medium">
                  Primeiro registro em: {formatter.date(signal.firstDetected)} | Última detecção: {formatter.date(signal.lastDetected)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">Severidade</span>
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-wider mt-0.5 inline-block",
                  signal.recurrence === 'SYSTEMIC' ? "text-rose-500" : "text-amber-500"
                )}>
                  {signal.recurrence === 'SYSTEMIC' ? "Crítica" : "Foco Requerido"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
