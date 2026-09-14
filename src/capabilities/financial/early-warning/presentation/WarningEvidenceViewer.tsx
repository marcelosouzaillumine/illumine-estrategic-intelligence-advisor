import React from 'react';
import { EarlyWarningSignalEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { Fingerprint } from 'lucide-react';

export function WarningEvidenceViewer({ tenantId }: { tenantId: string }) {
  const signals = EarlyWarningSignalEngine.getSignals(tenantId);

  if (signals.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Fingerprint className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Fiduciary Evidence Ledger</h3>
      </div>
      <div className="space-y-4">
        {signals.map(signal => {
          const ev = signal.evidence;
          const lin = ev.lineage;
          return (
            <div key={ev.evidenceId} className="bg-background border border-border/50 rounded p-3 text-xs">
              <div className="font-bold text-foreground mb-2">Sinal: {signal.signalId}</div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div><span className="text-foreground">Evidência:</span> {ev.description}</div>
                <div><span className="text-foreground">Execution:</span> {lin.executionId}</div>
                <div><span className="text-foreground">Graph Patterns:</span> {lin.graphPatternIds?.join(', ') || 'N/A'}</div>
                <div><span className="text-foreground">Workflows:</span> {lin.workflowIds?.join(', ') || 'N/A'}</div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                <span className="text-muted-foreground uppercase">Lineage Hash:</span>
                <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {lin.lineageHash}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
