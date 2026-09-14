import React from 'react';
import { useInstitutionalMemory } from '../../../../context/institutional-memory/InstitutionalMemoryProvider';
import { Fingerprint } from 'lucide-react';
import { useExecutiveFormatter } from "../../../../core/localization";

export function HistoricalLineageViewer() {
    const formatter = useExecutiveFormatter();
  const { records, lineageIntegrity } = useInstitutionalMemory();

  if (lineageIntegrity === 'FAIL_CLOSED' || records.length === 0) {
    return null;
  }

  return (
    <div className="card-premium p-6 bg-card/30 border border-border/40 space-y-4 animate-executive-fade text-xs font-semibold">
      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
        <Fingerprint size={14} className="text-secondary" />
        <span className="font-display font-medium tracking-tight text-foreground">Assinaturas de Lineage</span>
      </div>

      <div className="space-y-3 font-mono text-[9px] text-muted-foreground leading-normal">
        {records.map((r, idx) => (
          <div key={idx} className="flex justify-between items-center gap-4 p-2.5 rounded bg-surface-container/20 border border-border/10">
            <span>{formatter.date(r.timestamp)}</span>
            <span className="text-foreground font-bold">{r.lineageHash}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
