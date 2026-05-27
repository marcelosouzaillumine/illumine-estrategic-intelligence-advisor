import React from 'react';
import { useInstitutionalMemory } from '../../context/institutional-memory/InstitutionalMemoryProvider';
import { ShieldAlert, Compass } from 'lucide-react';
import { cn } from '../../lib/utils';

export function InstitutionalPatternMap() {
  const { recurrenceSignals, lineageIntegrity } = useInstitutionalMemory();

  if (lineageIntegrity === 'FAIL_CLOSED' || recurrenceSignals.length === 0) {
    return null;
  }

  return (
    <div className="card-premium p-8 bg-card/45 border border-border/60 space-y-6 animate-executive-fade leading-relaxed">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
            <Compass size={18} />
          </div>
          <div>
            <h3 className="text-h3 font-display font-medium text-foreground tracking-tight">Mapa de Padrões Cíclicos</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Categorização histórica de exposições recorrentes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recurrenceSignals.map((sig, idx) => (
          <div key={idx} className="p-4 bg-surface-container/20 border border-border/40 rounded-xl space-y-3 flex flex-col justify-between hover:bg-surface-container/30 transition-all">
            <div className="space-y-1">
              <span className={cn(
                "px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded border inline-block",
                sig.recurrence === 'SYSTEMIC' || sig.recurrence === 'CHRONIC'
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse"
                  : "bg-surface-container border-border text-muted-foreground"
              )}>
                {sig.recurrence}
              </span>
              <h4 className="text-xs font-semibold text-foreground tracking-tight pt-1">
                {sig.patternType.replace(/_/g, ' ')}
              </h4>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground font-semibold">
                <span>Frequência Histórica</span>
                <span className="text-foreground">{sig.frequencyCount}x</span>
              </div>
              <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full rounded-full",
                    sig.recurrence === 'SYSTEMIC' || sig.recurrence === 'CHRONIC'
                      ? "bg-rose-500"
                      : "bg-secondary"
                  )}
                  style={{ width: `${Math.min((sig.frequencyCount / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
