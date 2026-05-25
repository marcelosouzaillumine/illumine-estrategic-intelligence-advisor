import React from 'react';
import { StrategicDecisionSimulator } from '../../core/runtime/strategic-simulation/StrategicDecisionSimulator';
import { ShieldAlert } from 'lucide-react';

export function InstitutionalResiliencePanel({ tenantId }: { tenantId: string }) {
  const sims = StrategicDecisionSimulator.getSimulations(tenantId);
  if (sims.length === 0) return null;

  const resilience = sims[0].resilience;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Resilience Forecasting</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center p-4 bg-background border border-border/50 rounded">
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Pré-Decisão</div>
            <div className="text-2xl font-bold text-foreground">{Math.round(resilience.preDecisionScore * 100)}<span className="text-sm">/100</span></div>
          </div>
          <div className="text-muted-foreground">&rarr;</div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Pós-Decisão</div>
            <div className="text-2xl font-bold text-amber-500">{Math.round(resilience.postDecisionScore * 100)}<span className="text-sm">/100</span></div>
          </div>
        </div>

        {resilience.recoveryTimeMonths > 0 && (
          <div className="text-xs text-center text-muted-foreground">
            Tempo estimado de recuperação institucional: <span className="font-bold text-foreground">{resilience.recoveryTimeMonths} meses</span>
          </div>
        )}
      </div>
    </div>
  );
}
