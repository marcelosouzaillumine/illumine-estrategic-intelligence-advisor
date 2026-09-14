import React, { useEffect, useState } from 'react';
import { ProductAccessAuditLogger } from '../../../../services/FiduciaryRuntimeAdapter';
import { ProductAccessEvent } from '../../../../services/FiduciaryRuntimeAdapter';
import { ShieldAlert, ShieldCheck, Database, FileWarning, RefreshCw } from 'lucide-react';
import { useExecutiveFormatter } from "../../../../core/localization";

export function ProductAccessAuditFeed({ tenantId }: { tenantId: string }) {
    const formatter = useExecutiveFormatter();
  const [logs, setLogs] = useState<ProductAccessEvent[]>([]);

  const fetchLogs = () => {
      const formatter = useExecutiveFormatter();
    setLogs(ProductAccessAuditLogger.getLogsByTenant(tenantId).slice(0, 5)); // Mostra os 5 últimos
  };

  useEffect(() => {
      const formatter = useExecutiveFormatter();
    fetchLogs();
    // Polling removido por restrição de governança fiduciária ativa (Monitoring Governance)
  }, [tenantId]);

  const getIcon = (type: string) => {
      const formatter = useExecutiveFormatter();
    switch (type) {
      case 'FEATURE_BLOCKED': return <ShieldAlert size={14} className="text-rose-500" />;
      case 'FEATURE_GRANTED': return <ShieldCheck size={14} className="text-emerald-500" />;
      case 'QUOTA_CONSUMED': return <Database size={14} className="text-primary" />;
      case 'QUOTA_EXCEEDED': return <FileWarning size={14} className="text-rose-500" />;
      default: return <Database size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-surface-container border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Product Governance Audit Log</h3>
        <button onClick={fetchLogs} className="text-muted-foreground hover:text-primary"><RefreshCw size={14} /></button>
      </div>
      
      <div className="space-y-3">
        {logs.length === 0 && <div className="text-xs text-muted-foreground italic">Nenhum evento registrado recentemente.</div>}
        {logs.map(log => (
          <div key={log.eventId} className="flex gap-3 text-sm pb-3 border-b border-border/50 last:border-0 last:pb-0">
            <div className="mt-0.5 bg-background p-1.5 rounded-full border border-border">
              {getIcon(log.eventType)}
            </div>
            <div>
              <div className="font-medium text-foreground flex items-center gap-2">
                {log.eventType} 
                <span className="text-[10px] text-muted-foreground font-mono bg-background px-1.5 py-0.5 rounded border border-border">{log.resourceId}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">{log.details}</div>
              <div className="text-[10px] text-muted-foreground/60 mt-1">{formatter.date(log.timestamp, { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
