import React from 'react';
import { ConnectorRegistry, ExternalConnector } from '../../../../services/FiduciaryRuntimeAdapter';
import { SourceTrustBadge } from './SourceTrustBadge';
import { DownloadCloud, UploadCloud, Link as LinkIcon } from 'lucide-react';

export function ConnectorRegistryPanel({ onSimulateUpload }: { onSimulateUpload: (connectorId: string) => void }) {
  const connectors = ConnectorRegistry.getActiveConnectorsForTenant('TENANT-HQ');

  return (
    <div className="space-y-4">
      {connectors.map(conn => (
        <div key={conn.connectorId} className="flex items-center justify-between p-4 bg-background border border-border rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-surface-container rounded-md border border-border">
              {conn.type === 'MANUAL_CSV' || conn.type === 'MANUAL_XLSX' ? <UploadCloud className="text-muted-foreground" size={20} /> : <LinkIcon className="text-primary" size={20} />}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">{conn.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] text-muted-foreground font-mono bg-surface-container px-1 rounded">{conn.type}</span>
                <SourceTrustBadge trust={conn.baseTrustLevel} />
              </div>
            </div>
          </div>
          <button 
            onClick={() => onSimulateUpload(conn.connectorId)}
            className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors"
          >
            Simular Ingestão
          </button>
        </div>
      ))}
    </div>
  );
}
