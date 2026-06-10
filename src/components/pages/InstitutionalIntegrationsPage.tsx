import React, { useState, useEffect } from 'react';
import { PlugZap, AlertTriangle } from 'lucide-react';
import { PageHeader } from '../Common';
import { ConnectorRegistryPanel } from '../integrations/ConnectorRegistryPanel';
import { ImportReviewQueueTable } from '../integrations/ImportReviewQueueTable';
import { ConnectorExecutionEngine } from '../../services/FiduciaryRuntimeAdapter';
import { ImportReviewQueue } from '../../services/FiduciaryRuntimeAdapter';
import { ImportPublicationEngine } from '../../services/FiduciaryRuntimeAdapter';
import { ImportedDataset } from '../../services/FiduciaryRuntimeAdapter';

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
    const mockPayload = { _tenantId: mockTenant, simulateMissingColumn: true, data: [1, 2, 3] };
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Integrações Institucionais"
        subtitle="Pipeline Governado de Ingestão de Dados e Alfândega Fiduciária."
        icon={PlugZap}
        transparent
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Conectores Disponíveis</h3>
          <ConnectorRegistryPanel onSimulateUpload={handleSimulateUpload} />
          
          <div className="flex items-start gap-3 p-5 bg-warning-soft border border-warning/20 rounded-md text-warning">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Nota de Governança (MVP)</p>
              <p className="text-[10px] text-warning/80 leading-relaxed">
                Nenhum arquivo real sobe sem passar pelo Gateway. Simule a ingestão e acompanhe a Fila de Revisão.
              </p>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Import Review Queue <span className="text-muted-foreground font-normal text-body-sm ml-2">(Staging)</span></h3>
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
