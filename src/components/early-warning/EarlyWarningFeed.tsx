import React, { useEffect, useState } from 'react';
import { EarlyWarningSignalEngine } from '../../core/runtime/early-warning/EarlyWarningSignalEngine';
import { PredictiveRiskEvent } from '../../core/runtime/early-warning/EarlyWarningTypes';
import { Siren, AlertTriangle } from 'lucide-react';

export function EarlyWarningFeed({ tenantId }: { tenantId: string }) {
  const [event, setEvent] = useState<PredictiveRiskEvent | null>(null);

  useEffect(() => {
    EarlyWarningSignalEngine.clearSignals(tenantId);
    const result = EarlyWarningSignalEngine.executeDetection(tenantId);
    setEvent(result);
  }, [tenantId]);

  if (!event || event.relatedSignals.length === 0) {
    return <div className="text-muted-foreground p-4">Nenhum alerta antecipado detectado pela engine institucional.</div>;
  }

  return (
    <div className="space-y-4">
      {event.relatedSignals.map(signal => (
        <div key={signal.signalId} className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-5">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <Siren className="text-rose-500 animate-pulse" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-rose-500">{signal.title}</h3>
                  <div className="text-xs font-mono text-muted-foreground mt-1">ID: {signal.signalId} | {new Date(signal.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <span className="bg-rose-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                    {signal.severity}
                  </span>
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/20 text-[10px] uppercase font-bold px-2 py-1 rounded">
                    CONFIDENCE: {signal.predictiveConfidence}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground">{signal.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
