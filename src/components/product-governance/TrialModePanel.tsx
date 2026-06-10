import React from 'react';
import { Timer } from 'lucide-react';

export function TrialModePanel({ isTrial, endDate }: { isTrial: boolean, endDate?: string }) {
  if (!isTrial) return null;

  return (
    <div className="bg-warning-soft0/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-4">
      <Timer className="text-amber-500 mt-0.5" />
      <div>
        <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-widest">Trial Mode Active</h3>
        <p className="text-xs text-foreground mt-1">Este tenant está operando em modo de avaliação restrito.</p>
        {endDate && <p className="text-xs font-mono text-muted-foreground mt-2">Expira em: {new Date(endDate).toLocaleDateString()}</p>}
      </div>
    </div>
  );
}
