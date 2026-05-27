import React from 'react';
import { useInstitutionalMemory } from '../../context/institutional-memory/InstitutionalMemoryProvider';
import { Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

export function HistoricalGovernanceNavigator() {
  const { records, lineageIntegrity } = useInstitutionalMemory();

  if (lineageIntegrity === 'FAIL_CLOSED' || records.length === 0) {
    return null;
  }

  // Sort chronological ascending
  const sorted = [...records].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 border-b border-border/20 text-xs font-semibold">
      <div className="flex items-center gap-1.5 text-muted-foreground mr-2 shrink-0">
        <Calendar size={13} />
        <span>Ciclos Disponíveis:</span>
      </div>
      <div className="flex items-center gap-2">
        {sorted.map((r, idx) => (
          <div
            key={r.memoryId}
            className="px-3 py-1 bg-surface-container/60 border border-border/40 text-muted-foreground text-[10px] font-bold uppercase tracking-wider rounded-lg select-none shrink-0"
            title={`Snapshot ${r.governanceCategory}`}
          >
            {new Date(r.timestamp).toLocaleDateString()}
          </div>
        ))}
      </div>
    </div>
  );
}
