import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { PilotGovernanceChecklist } from '../../services/FiduciaryRuntimeAdapter';

export function PilotReadinessPanel({ tenantId }: { tenantId: string }) {
  const checks = PilotGovernanceChecklist.evaluate(tenantId);

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Pilot Governance Checks</h3>
      </div>
      <div className="space-y-2">
        {checks.map(check => (
          <div key={check.checkId} className="flex justify-between items-center p-2 bg-background border border-border/50 rounded">
            <span className="text-xs text-foreground">{check.name}</span>
            {check.passed ? (
              <span className="text-[10px] bg-success-soft0/20 text-emerald-500 px-2 py-0.5 rounded font-bold">PASSED</span>
            ) : (
              <span className="text-[10px] bg-critical-soft0/20 text-rose-500 px-2 py-0.5 rounded font-bold">FAILED</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
