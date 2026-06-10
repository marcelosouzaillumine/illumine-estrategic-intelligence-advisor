import React from 'react';
import { useInstitutionalMemory } from '../../context/institutional-memory/InstitutionalMemoryProvider';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';

export function MemoryIntegrityBadge() {
  const { lineageIntegrity } = useInstitutionalMemory();

  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider",
      lineageIntegrity === 'VERIFIED'
        ? "bg-success-soft0/10 text-emerald-400 border-emerald-500/20"
        : lineageIntegrity === 'FAIL_CLOSED'
        ? "bg-critical-soft0/10 text-rose-400 border-rose-500/20"
        : "bg-warning-soft0/10 text-amber-400 border-amber-500/20"
    )}>
      {lineageIntegrity === 'VERIFIED' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
      <span>Lineage: {lineageIntegrity}</span>
    </div>
  );
}
