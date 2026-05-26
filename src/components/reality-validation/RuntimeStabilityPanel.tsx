import React from 'react';
import { Activity } from 'lucide-react';
import { InstitutionalSessionStabilityEngine } from '../../core/runtime/operational-scale/InstitutionalSessionStabilityEngine';

export function RuntimeStabilityPanel({ tenantId }: { tenantId: string }) {
  const report = InstitutionalSessionStabilityEngine.evaluate(tenantId, 120);

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Runtime Session Stability</h3>
      </div>
      <div className="space-y-2 text-xs">
        {[
          { label: 'State Consistency', ok: report.stateConsistencyOk },
          { label: 'Memory Leak Free', ok: !report.memoryLeakDetected },
          { label: 'IOS Stability', ok: report.iosStabilityOk }
        ].map(item => (
          <div key={item.label} className="flex justify-between items-center p-2 bg-background border border-border/50 rounded">
            <span className="text-foreground">{item.label}</span>
            <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${item.ok ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
              {item.ok ? 'OK' : 'FAIL'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 text-[10px] text-muted-foreground text-right">
        Session: {report.sessionDurationMinutes} min simulados
      </div>
    </div>
  );
}
