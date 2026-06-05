import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { CrossTenantStressValidator } from '../../services/FiduciaryRuntimeAdapter';

export function CrossTenantStressViewer({ tenantIds }: { tenantIds: string[] }) {
  const result = CrossTenantStressValidator.validate(tenantIds);

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="text-amber-500" />
        <h3 className="text-sm font-semibold text-foreground">Cross-Tenant Stress</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-3 bg-background border border-border/50 rounded">
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Tenants</div>
          <div className="text-lg font-bold text-foreground">{tenantIds.length}</div>
        </div>
        <div className="p-3 bg-background border border-border/50 rounded">
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Switches</div>
          <div className="text-lg font-bold text-primary">{result.switchesValidated}</div>
        </div>
        <div className={`p-3 border rounded ${result.leakageDetected ? 'bg-rose-500/10 border-rose-500/30' : 'bg-emerald-500/10 border-emerald-500/30'}`}>
          <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Leakage</div>
          <div className={`text-lg font-bold ${result.leakageDetected ? 'text-rose-500' : 'text-emerald-500'}`}>
            {result.leakageDetected ? 'SIM' : 'NÃO'}
          </div>
        </div>
      </div>
    </div>
  );
}
