import React from 'react';
import { useInstitutionalMemory } from '../../../../context/institutional-memory/InstitutionalMemoryProvider';
import { Sparkles, Fingerprint, Calendar } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { useExecutiveFormatter } from "../../../../core/localization";

export function AdvisoryContinuitySurface() {
    const formatter = useExecutiveFormatter();
  const { advisoryContinuity, lineageIntegrity } = useInstitutionalMemory();

  if (lineageIntegrity === 'FAIL_CLOSED' || advisoryContinuity.length === 0) {
    return null;
  }

  return (
    <div className="card-premium p-8 bg-card/45 border border-border/60 space-y-6 animate-executive-fade leading-relaxed">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-primary rounded-lg">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-h3 font-display font-medium text-foreground tracking-tight">Continuidade de Diretrizes de Conselho</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Rastreamento de recomendações ignoradas ou recorrentes</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {advisoryContinuity.map((rec, idx) => (
          <div 
            key={idx} 
            className={cn(
              "p-4 border rounded-xl space-y-3 bg-surface-container/20 border-border/40",
              rec.unresolved ? "border-amber-500/25 bg-warning-soft0/[0.02]" : ""
            )}
          >
            <div className="flex justify-between items-start gap-4">
              <p className="text-xs font-semibold text-foreground leading-normal">{rec.recommendationText}</p>
              <div className="text-right shrink-0">
                <span className="px-2 py-0.5 bg-surface-container border border-border text-[9px] font-black tracking-wider uppercase rounded">
                  Emitida {rec.timesIssued}x
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-[10px] text-muted-foreground font-semibold">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Calendar size={12} className="text-secondary" />
                <span>Primeira emissão: {formatter.date(rec.firstIssuedAt)}</span>
                {rec.timesIssued > 1 && (
                  <span>• Última: {formatter.date(rec.lastIssuedAt)}</span>
                )}
              </div>

              {rec.originatingLineages.length > 0 && (
                <div className="flex items-center gap-1.5 font-mono text-[9px]">
                  <Fingerprint size={11} className="text-secondary" />
                  <span>Lineage: {rec.originatingLineages[0]}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
