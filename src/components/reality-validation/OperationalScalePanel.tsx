import React from 'react';
import { Server } from 'lucide-react';
import { OperationalScalabilityEvaluator } from '../../core/runtime/operational-scale/OperationalScalabilityEvaluator';

interface Props { tenantId: string }

export function OperationalScalePanel({ tenantId }: Props) {
  const report = OperationalScalabilityEvaluator.evaluate(tenantId);

  const statusColor = report.status === 'READY' ? 'text-emerald-500' : report.status === 'WARNING' ? 'text-amber-500' : 'text-rose-500';

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Server className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-foreground">Operational Scale Readiness</h3>
        <span className={`ml-auto text-xs font-bold ${statusColor}`}>{report.status}</span>
      </div>
      <div className="space-y-3">
        {[
          { label: 'Concurrency Score', value: report.concurrencyScore },
          { label: 'Session Stability', value: report.sessionStabilityScore },
          { label: 'Recovery Score', value: report.recoveryScore }
        ].map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-bold text-foreground">{(item.value * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-border/50 h-2 rounded overflow-hidden">
              <div
                className={`h-full rounded ${item.value >= 0.85 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${item.value * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        <div className={`w-2 h-2 rounded-full ${report.crossTenantIsolationValid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <span className="text-muted-foreground">Cross-Tenant Isolation: {report.crossTenantIsolationValid ? 'VÁLIDO' : 'VIOLADO'}</span>
      </div>
    </div>
  );
}
