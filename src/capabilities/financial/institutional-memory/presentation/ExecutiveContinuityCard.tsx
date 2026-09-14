import React from 'react';
import { useInstitutionalMemory } from '../../../../context/institutional-memory/InstitutionalMemoryProvider';
import { History, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../../../../lib/utils';

export function ExecutiveContinuityCard() {
  const { records, historicalConfidence, lineageIntegrity } = useInstitutionalMemory();

  return (
    <div className="card-premium p-6 flex flex-col justify-between hover:border-secondary/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Histórico Longitudinal</h3>
        <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
          <History size={16} />
        </div>
      </div>
      
      <div className="space-y-3">
        <div>
          <div className="text-2xl font-light text-foreground">{records.length} Ciclos</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Registros Salvos</div>
        </div>

        <div className="pt-2 border-t border-border/40 space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground font-semibold">Confiança Histórica:</span>
            <span className="font-bold text-foreground">{historicalConfidence}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground font-semibold">Integridade Lineage:</span>
            <span className={cn(
              "font-bold",
              lineageIntegrity === 'VERIFIED' ? "text-emerald-400" : "text-amber-400"
            )}>{lineageIntegrity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
