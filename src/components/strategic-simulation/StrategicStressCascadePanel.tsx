import { StrategicDecisionSimulator } from '../../services/FiduciaryRuntimeAdapter';
import { Zap } from 'lucide-react';
import React from 'react';

export function StrategicStressCascadePanel({ tenantId }: { tenantId: string }) {
  const sims = StrategicDecisionSimulator.getSimulations(tenantId);
  if (sims.length === 0) return null;

  const { consequences, risks } = sims[0];
  
  if (consequences.length === 0 && risks.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="text-rose-500" />
        <h3 className="text-sm font-semibold text-foreground">Efeito Dominó & Cascatas de Stress</h3>
      </div>
      
      <div className="space-y-3 mb-4">
        {consequences.map(c => (
          <div key={c.consequenceId} className="p-3 bg-background border border-rose-500/30 rounded text-sm text-foreground flex items-start gap-2">
            <span className="text-rose-500 font-bold">[{c.targetEntityId}]</span>
            <span>{c.description}</span>
          </div>
        ))}
      </div>

      {risks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="text-xs uppercase font-bold text-rose-500 mb-2">Risco de Colapso em Cadeia Detectado</div>
          {risks.map(r => (
            <div key={r.riskId} className="p-3 bg-rose-500/10 border border-rose-500/20 rounded text-sm text-rose-500 font-medium">
              {r.description} (Probabilidade: {Math.round(r.probability * 100)}%)
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
