import React from 'react';
import { GraphPatternWarningEngine } from '../../core/runtime/early-warning/GraphPatternWarningEngine';
import { Network } from 'lucide-react';

export function GraphPatternAlertPanel({ tenantId }: { tenantId: string }) {
  const anomalies = GraphPatternWarningEngine.detectGraphAnomalies(tenantId);

  if (anomalies.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Network className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Semantic Graph Anomalies</h3>
      </div>
      <div className="space-y-2">
        {anomalies.map((a, i) => (
          <div key={i} className="p-3 bg-background border border-border/50 rounded text-sm text-foreground">
            {String(a.metadata.insight)}
          </div>
        ))}
      </div>
    </div>
  );
}
