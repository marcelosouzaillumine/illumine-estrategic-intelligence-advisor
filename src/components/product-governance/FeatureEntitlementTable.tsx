import React from 'react';
import { ProductGovernanceEngine } from '../../services/FiduciaryRuntimeAdapter';
import { FeatureId } from '../../services/FiduciaryRuntimeAdapter';
import { CheckCircle2, Lock } from 'lucide-react';

export function FeatureEntitlementTable({ tenantId }: { tenantId: string }) {
  const featuresToTest: { id: FeatureId; label: string }[] = [
    { id: 'SCENARIO_RUNTIME', label: 'Cenários Simulados' },
    { id: 'AI_COPILOT_BASIC', label: 'Copiloto de IA Básico' },
    { id: 'AI_COPILOT_ENTERPRISE', label: 'Copiloto de IA Enterprise' },
    { id: 'INSTITUTIONAL_BENCHMARKING', label: 'Benchmarking Institucional' }
  ];

  return (
    <div className="border border-border rounded-lg bg-background overflow-hidden">
      <div className="bg-surface-container px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Feature Entitlements Resolvidos</h3>
      </div>
      <div className="divide-y divide-border">
        {featuresToTest.map(f => {
          const isGranted = ProductGovernanceEngine.requestFeatureAccess(tenantId, f.id);
          return (
            <div key={f.id} className="flex items-center justify-between p-4">
              <span className="text-sm font-medium text-foreground">{f.label}</span>
              {isGranted ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium bg-emerald-500/10 px-2 py-1 rounded">
                  <CheckCircle2 size={14} /> Autorizado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-medium bg-rose-500/10 px-2 py-1 rounded border border-rose-500/20">
                  <Lock size={14} /> Bloqueado pelo Plano
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
