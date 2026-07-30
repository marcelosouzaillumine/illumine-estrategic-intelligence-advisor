import React from 'react';
import { Database, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';

export interface PlatformGovernanceOverviewProps {
  readonly totalRecords: number;
  readonly activeRecords: number;
  readonly pendingRecords?: number;
  readonly dataCompletenessPercent?: number;
  readonly lastSyncTimestamp?: string;
}

export const PlatformGovernanceOverview: React.FC<PlatformGovernanceOverviewProps> = ({
  totalRecords,
  activeRecords,
  pendingRecords = 0,
  dataCompletenessPercent = 98.5,
  lastSyncTimestamp = 'Hoje, 04:30'
}) => {
  return (
    <ExecutiveSurface className="p-4 mb-6 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Layer 2 — Integridade & Saúde Cadastral de Governança
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success" className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Completude: {dataCompletenessPercent}%</span>
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Cadastrado</span>
          <span className="font-bold text-foreground text-lg">{totalRecords}</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Registros Ativos</span>
          <span className="font-bold text-success text-lg">{activeRecords}</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Pendências de Cadastro</span>
          <span className="font-bold text-warning text-lg">{pendingRecords}</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <div className="flex items-center gap-1 text-muted-foreground text-[10px] uppercase font-semibold mb-1">
            <Activity className="w-3 h-3 text-primary" />
            <span>Última Sincronização</span>
          </div>
          <span className="font-medium text-foreground">{lastSyncTimestamp}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
