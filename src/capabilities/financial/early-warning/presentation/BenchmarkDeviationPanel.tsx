import React from 'react';
import { BenchmarkDeviationDetector } from '../../../../services/FiduciaryRuntimeAdapter';
import { BarChart2 } from 'lucide-react';

export function BenchmarkDeviationPanel({ tenantId }: { tenantId: string }) {
  const deviations = BenchmarkDeviationDetector.detectDeviations(tenantId);

  if (deviations.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Sector Deviation (K-Anonymized)</h3>
      </div>
      <div className="space-y-2">
        {deviations.map((d, i) => (
          <div key={i} className="p-3 bg-background border border-border/50 rounded text-sm text-foreground">
             {String(d.metadata.insight)}
          </div>
        ))}
      </div>
    </div>
  );
}
