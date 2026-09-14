import React from 'react';
import { Database } from 'lucide-react';
import { RealDataValidationEngine } from '../../../../services/FiduciaryRuntimeAdapter';

export function RealDataValidationPanel({ tenantId }: { tenantId: string }) {
  const state = RealDataValidationEngine.getValidationState(tenantId);
  if (!state) return null;

  const { health } = state;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Golden Dataset Health</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-background border border-border/50 rounded flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Completeness</span>
          <span className="text-xl font-bold text-emerald-500">{(health.completeness * 100).toFixed(0)}%</span>
        </div>
        <div className="p-3 bg-background border border-border/50 rounded flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Accuracy</span>
          <span className="text-xl font-bold text-emerald-500">{(health.accuracy * 100).toFixed(0)}%</span>
        </div>
        <div className="p-3 bg-background border border-border/50 rounded flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Timeliness</span>
          <span className="text-xl font-bold text-emerald-500">{(health.timeliness * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
