import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveText } from '../../ui/executive-typography';
import { SaaSAuditTrailContract } from '@illumine/executive-contracts';

export interface SaaSAuditTrailCardProps {
  readonly auditLog: SaaSAuditTrailContract;
}

export const SaaSAuditTrailCard: React.FC<SaaSAuditTrailCardProps> = ({ auditLog }) => {
  return (
    <ExecutiveSurface className="p-3 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
            Audit Trail ({auditLog.actionType})
          </ExecutiveText>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{auditLog.correlationId}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>Ator: <strong className="text-foreground">{auditLog.actorUserId}</strong></span>
        <span>Status: <strong className="text-success">{auditLog.resultStatus}</strong></span>
      </div>
    </ExecutiveSurface>
  );
};
