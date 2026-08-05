import React from 'react';
import { MonitoringAlert } from '../../services/FiduciaryRuntimeAdapter';
import { AlertSeverityBadge } from './AlertSeverityBadge';
import { Hash } from 'lucide-react';
import { useExecutiveFormatter } from '../../core/localization';

export function MonitoringAlertFeed({ alerts }: { alerts: MonitoringAlert[] }) {
  const formatter = useExecutiveFormatter();
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface-container border border-border rounded-xl text-muted-foreground h-full">
        <p className="text-sm">Nenhum alerta institucional ativo no momento.</p>
        <p className="text-xs mt-1">O grupo econômico encontra-se estável sob os parâmetros do Runtime.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div key={alert.alertId} className="flex flex-col p-4 bg-background border border-border rounded-lg shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <AlertSeverityBadge severity={alert.severity} />
            <span className="text-[10px] text-muted-foreground">{formatter.date(alert.timestamp)}</span>
          </div>
          
          <h4 className="text-sm font-semibold text-foreground mb-1">{alert.message}</h4>
          
          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium bg-surface-container px-2 py-0.5 rounded border border-border">Rule: {alert.ruleId}</span>
            <div className="flex items-center gap-1 font-mono text-[10px]" title={alert.lineage.snapshotHash}>
              <Hash size={10} /> {alert.lineage.snapshotHash?.substring(0, 8) || 'N/A'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
