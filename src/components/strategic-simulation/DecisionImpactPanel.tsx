import React from 'react';
import { StrategicDecisionSimulator } from '../../services/FiduciaryRuntimeAdapter';
import { Activity } from 'lucide-react';

export function DecisionImpactPanel({ tenantId }: { tenantId: string }) {
  const sims = StrategicDecisionSimulator.getSimulations(tenantId);
  if (sims.length === 0 || sims[0].impacts.length === 0) return null;

  const impacts = sims[0].impacts;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Impacto Bruto Projetado</h3>
      </div>
      <div className="space-y-3">
        {impacts.map(impact => (
          <div key={impact.impactId} className="flex flex-col gap-1 p-3 bg-background border border-border/50 rounded">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-foreground uppercase">{impact.domain}</span>
              <span className={'text-xs font-bold px-2 py-0.5 rounded ' + (impact.delta > 0 ? 'bg-success-soft0/10 text-emerald-500' : 'bg-critical-soft0/10 text-rose-500')}>
                {impact.delta > 0 ? '+' : ''}{Math.round(impact.delta * 100)}%
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{impact.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
