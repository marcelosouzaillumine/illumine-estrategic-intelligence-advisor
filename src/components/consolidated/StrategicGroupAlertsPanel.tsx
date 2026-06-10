import React from 'react';
import { AlertCircle } from 'lucide-react';

export function StrategicGroupAlertsPanel({ alerts }: { alerts: string[] }) {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
      <h3 className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
        <AlertCircle size={16} className="text-amber-500" />
        Alertas Estratégicos Ativos
      </h3>
      <div className="space-y-3">
        {alerts.map((alert, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-warning-soft/50 border border-amber-100 flex gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">{alert}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
