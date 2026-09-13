import React from 'react';
import { InstitutionalOperatingSystem } from '../../../../services/FiduciaryRuntimeAdapter';
import { Activity } from 'lucide-react';

export function InstitutionalPulsePanel({ tenantId }: { tenantId: string }) {
  const state = InstitutionalOperatingSystem.getState(tenantId);
  if (!state) return null;

  const { pulse } = state;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Activity size={100} />
      </div>
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Institutional Pulse</h3>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-background border border-border/50 rounded flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Systemic Pressure</span>
          <span className="text-3xl font-bold text-rose-500">{(pulse.systemicPressureScore * 100).toFixed(0)}%</span>
        </div>
        <div className="p-4 bg-background border border-border/50 rounded flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Operational Saturation</span>
          <span className="text-3xl font-bold text-amber-500">{(pulse.operationalSaturationScore * 100).toFixed(0)}%</span>
        </div>
        <div className="p-4 bg-background border border-border/50 rounded flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-bold mb-2">Governance Stability</span>
          <span className="text-3xl font-bold text-emerald-500">{(pulse.governanceStabilityScore * 100).toFixed(0)}%</span>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-xs bg-background p-3 rounded border border-border/50">
        <div><span className="text-muted-foreground">Resilience Trend:</span> <span className="font-bold text-rose-500">{pulse.resilienceTrend}</span></div>
        <div><span className="text-muted-foreground">Pulse Hash:</span> <span className="font-mono text-primary bg-primary/10 px-1 rounded">{pulse.lineage.lineageHash}</span></div>
      </div>
    </div>
  );
}
