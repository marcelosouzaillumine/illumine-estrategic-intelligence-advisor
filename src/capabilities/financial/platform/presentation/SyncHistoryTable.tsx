import React from 'react';
import { History, CheckCircle } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface SyncHistoryItem {
  readonly id: string;
  readonly connectorName: string;
  readonly recordsCount: number;
  readonly status: 'SUCCESS' | 'WARNING' | 'FAILED';
  readonly timestamp: string;
}

export interface SyncHistoryTableProps {
  readonly history: readonly SyncHistoryItem[];
}

export const SyncHistoryTable: React.FC<SyncHistoryTableProps> = ({ history }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <History className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Histórico de Sincronização do Data Fabric
        </ExecutiveText>
      </div>

      <div className="space-y-2 text-xs">
        {history.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-2.5 bg-surface-container/30 rounded border border-border/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-success" />
              <span className="font-medium text-foreground">{item.connectorName}</span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-[10px]">
              <span>{item.recordsCount} registros</span>
              <span>{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
