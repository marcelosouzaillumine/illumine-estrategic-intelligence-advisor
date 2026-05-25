import React from 'react';
import { Building2 } from 'lucide-react';

export function AffectedEntitiesPanel({ entities }: { entities: string[] }) {
  if (!entities || entities.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Building2 size={14} className="text-rose-500" /> Entidades Afetadas
      </h4>
      <div className="flex flex-wrap gap-2">
        {entities.map(e => (
          <span key={e} className="px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-full text-xs font-medium">
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
