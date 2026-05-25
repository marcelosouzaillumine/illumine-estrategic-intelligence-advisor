import React from 'react';
import { StrategicDecisionSimulator } from '../../core/runtime/strategic-simulation/StrategicDecisionSimulator';
import { Scale } from 'lucide-react';

export function GovernanceTradeoffPanel({ tenantId }: { tenantId: string }) {
  const sims = StrategicDecisionSimulator.getSimulations(tenantId);
  if (sims.length === 0 || sims[0].tradeoffs.length === 0) return null;

  const tradeoffs = sims[0].tradeoffs;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-foreground">Governance Trade-offs</h3>
      </div>
      <div className="space-y-4">
        {tradeoffs.map(t => (
          <div key={t.tradeoffId} className="relative p-4 bg-background border border-border/50 rounded grid grid-cols-2 gap-4">
            <div className="pr-4 border-r border-border/50">
              <div className="text-[10px] uppercase font-bold text-emerald-500 mb-1">Ganhos em {t.gainDomain}</div>
              <div className="text-sm text-foreground">{t.gainDescription}</div>
            </div>
            <div className="pl-2">
              <div className="text-[10px] uppercase font-bold text-rose-500 mb-1">Perdas em {t.lossDomain}</div>
              <div className="text-sm text-foreground">{t.lossDescription}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
