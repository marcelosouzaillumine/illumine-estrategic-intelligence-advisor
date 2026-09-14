import React from 'react';
import { RiskCorrelationEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { ShieldAlert } from 'lucide-react';

export function RiskCorrelationPanel({ tenantId }: { tenantId: string }) {
  const correlations = RiskCorrelationEngine.analyzeCorrelations(tenantId);

  if (correlations.length === 0) return null;

  return (
    <div className="bg-critical-soft0/5 border border-rose-500/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="text-rose-500" />
        <h3 className="text-sm font-semibold text-rose-500">Risk Correlations Detected</h3>
      </div>
      <div className="space-y-3">
        {correlations.map(c => (
          <div key={c.correlationId} className="bg-background p-3 rounded border border-border text-sm">
            <div className="text-foreground">{c.description}</div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] uppercase font-semibold text-rose-500 bg-critical-soft0/10 px-1.5 py-0.5 rounded">
                CONFIDENCE: {c.confidenceLevel}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">{c.correlationId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
