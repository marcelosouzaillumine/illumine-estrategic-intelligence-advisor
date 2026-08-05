import React from 'react';
import { WorkflowAuditRecord } from '../../services/FiduciaryRuntimeAdapter';
import { useExecutiveFormatter } from "../../core/localization";

export function WorkflowAuditFeed({ logs }: { logs: WorkflowAuditRecord[] }) {
    const formatter = useExecutiveFormatter();
  if (logs.length === 0) {
    return <div className="text-xs text-muted-foreground">Nenhuma trilha de auditoria disponível.</div>;
  }

  return (
    <div className="space-y-2">
      {logs.map(log => (
        <div key={log.auditId} className="flex flex-col p-2 bg-surface-container border border-border rounded text-[10px]">
          <div className="flex justify-between items-center mb-1 font-mono text-muted-foreground">
            <span>{log.event}</span>
            <span>{formatter.date(log.timestamp, { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <span className="text-foreground">
            <strong>{log.actor.name}</strong> ({log.actor.role}) {log.details ? `- ${log.details}` : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
