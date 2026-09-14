import React from 'react';
import { EarlyWarningSignalEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { Clock } from 'lucide-react';
import { useExecutiveFormatter } from "../../../../core/localization";

export function EarlyWarningTimeline({ tenantId }: { tenantId: string }) {
    const formatter = useExecutiveFormatter();
  const signals = EarlyWarningSignalEngine.getSignals(tenantId);

  if (signals.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Timeline de Sinais Preditivos</h3>
      </div>
      <div className="relative border-l border-border/50 ml-3 space-y-6">
        {signals.map(signal => (
          <div key={signal.signalId} className="relative pl-6">
            <div className="absolute w-3 h-3 bg-critical-soft0 rounded-full -left-1.5 top-1.5 border-2 border-background"></div>
            <div className="text-xs text-muted-foreground font-mono">{formatter.date(signal.createdAt, { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-sm font-medium text-foreground mt-1">{signal.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{signal.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
