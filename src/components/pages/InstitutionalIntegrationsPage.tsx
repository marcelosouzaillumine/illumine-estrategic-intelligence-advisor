import React, { useState, useEffect } from 'react';
import { PlugZap } from 'lucide-react';
import { ConnectorRegistryPanel } from '../integrations/ConnectorRegistryPanel';
import { ImportReviewQueueTable } from '../integrations/ImportReviewQueueTable';
import { ConnectorExecutionEngine } from '../../core/runtime/integrations/ConnectorExecutionEngine';
import { ImportReviewQueue } from '../../core/runtime/integrations/ImportReviewQueue';
import { ImportPublicationEngine } from '../../core/runtime/integrations/ImportPublicationEngine';
import { ImportedDataset } from '../../core/runtime/integrations/IntegrationGovernanceTypes';

export function InstitutionalIntegrationsPage() {
  const [queue, setQueue] = useState<ImportedDataset[]>([]);
  
  const mockTenant = 'TENANT-HQ';
  const mockWorkspace = 'WS-1';
  const mockActor = 'USER-1';

  const loadState = () => {
    setQueue([...ImportReviewQueue.getQueueForTenant(mockTenant, mockWorkspace)]);
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleSimulateUpload = (connectorId: string) => {
    const mockPayload = { _tenantId: mockTenant, simulateMissingColumn: true, data: [1, 2, 3] }; // Força Warning para mostrar o Gatekeeper agindo
    ConnectorExecutionEngine.executeIngestion(mockTenant, mockWorkspace, connectorId, mockPayload, mockActor);
    loadState();
  };

  const handleApprove = (importId: string) => {
    ImportReviewQueue.updateStatus(importId, 'APPROVED');
    loadState();
  };

  const handlePublish = (dataset: ImportedDataset) => {
    ImportPublicationEngine.publish(dataset, mockActor);
    ImportReviewQueue.updateStatus(dataset.importId, 'PUBLISHED');
    loadState();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <PlugZap className="text-primary" />
          Integrações Institucionais
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Pipeline Governado de Ingestão de Dados e Alfândega Fiduciária.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border-r border-border pr-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Conectores Disponíveis</h3>
          <ConnectorRegistryPanel onSimulateUpload={handleSimulateUpload} />
          
          <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-xs">
            <strong className="block mb-1">Nota de Governança (MVP)</strong>
            Nenhum arquivo real sobe sem passar pelo Gateway. Simule a ingestão e acompanhe a Fila de Revisão ao lado.
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-foreground mb-4">Import Review Queue (Staging)</h3>
          <ImportReviewQueueTable 
            queue={queue} 
            onApprove={handleApprove} 
            onPublish={handlePublish} 
          />
        </div>
      </div>
    </div>
  );
}
