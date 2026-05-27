import React from 'react';
import { useInstitutionalMemory } from '../../context/institutional-memory/InstitutionalMemoryProvider';
import { Activity } from 'lucide-react';

export function HistoricalEvidenceCoverage() {
  const { records, lineageIntegrity } = useInstitutionalMemory();

  if (records.length === 0) {
    return null;
  }

  // Calculate percentage of verified vs total records
  const total = records.length;
  const verified = records.filter(r => r.integrityStatus === 'VERIFIED').length;
  const coveragePercent = total > 0 ? (verified / total) * 100 : 0;

  return (
    <div className="card-premium p-6 bg-card/30 border border-border/40 space-y-4 animate-executive-fade text-xs">
      <div className="flex items-center gap-2 pb-2 border-b border-border/30">
        <Activity size={14} className="text-secondary" />
        <span className="font-display font-medium tracking-tight text-foreground">Cobertura de Evidências Históricas</span>
      </div>

      <div className="space-y-3 font-semibold">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-muted-foreground uppercase tracking-wider">Registros Auditados</span>
            <span className="text-foreground">{verified} / {total} verified</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-700" 
              style={{ width: `${coveragePercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
