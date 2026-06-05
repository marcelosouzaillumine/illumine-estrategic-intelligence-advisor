import React from 'react';
import { InstitutionalOperatingSystem } from '../../services/FiduciaryRuntimeAdapter';
import { Target } from 'lucide-react';

export function InstitutionalContextViewer({ tenantId }: { tenantId: string }) {
  const state = InstitutionalOperatingSystem.getState(tenantId);
  if (!state) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Institutional Context</h3>
      </div>
      <div className="bg-background border border-border/50 p-4 rounded text-sm mb-4">
        <p className="text-foreground">{state.context.description}</p>
      </div>
      <div className="flex gap-4">
        <div className="flex-1 bg-background border border-border/50 p-3 rounded">
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Primary Vector</div>
          <div className="text-sm font-bold text-rose-500">{state.context.primaryStressVector}</div>
        </div>
        <div className="flex-1 bg-background border border-border/50 p-3 rounded">
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Recovery Momentum</div>
          <div className="text-sm font-bold text-amber-500">{state.context.recoveryMomentum}</div>
        </div>
      </div>
    </div>
  );
}
