import React from 'react';
import { History, Shield, User } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface AuditLogItem {
  readonly id: string;
  readonly user: string;
  readonly action: string;
  readonly timestamp: string;
  readonly details?: string;
}

export interface PlatformAuditTrailProps {
  readonly logs: readonly AuditLogItem[];
}

export const PlatformAuditTrail: React.FC<PlatformAuditTrailProps> = ({ logs }) => {
  return (
    <ExecutiveSurface className="p-4 mb-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <History className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Layer 6 — Audit Trail & Rastreabilidade de Governança
        </ExecutiveText>
      </div>

      <div className="space-y-2 text-xs">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center justify-between p-2 bg-surface-container/30 rounded border border-border/30">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{log.user}:</span>
              <span className="text-muted-foreground">{log.action}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
              <span>{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
