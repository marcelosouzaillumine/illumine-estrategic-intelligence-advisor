

import React, { useState, useEffect } from 'react';
import { PlugZap, AlertTriangle } from 'lucide-react';
import { ConnectorRegistryPanel } from '../../../../components/integrations/ConnectorRegistryPanel';
import { ImportReviewQueueTable } from '../../../../components/integrations/ImportReviewQueueTable';
import { ConnectorExecutionEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { ImportReviewQueue } from '../../../../services/FiduciaryRuntimeAdapter';
import { ImportPublicationEngine } from '../../../../services/FiduciaryRuntimeAdapter';
import { ImportedDataset } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { StatusBadge } from '../../../../components/Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useInstitutionalIntegrationsPageViewModel } from '../../../../viewmodels/useInstitutionalIntegrationsPageViewModel';

export function InstitutionalIntegrationsPage() {
  // Adapter: useInstitutionalIntegrationsPageAdapter
  // ViewModel: useInstitutionalIntegrationsPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalIntegrationsPageViewModel({ clientId: '' });
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
    <ExecutivePageTemplate header={{
      title: "Integrações Institucionais",
      description: "Pipeline Governado de Ingestão de Dados e Alfândega Fiduciária.",
    }}>

       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

         <div className="flex items-center gap-3">
           <StatusBadge status="Ativo" label="Gateway Ativo" />
           <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Alfândega Fiduciária ·  {queue.length} item(s) na fila</span>
         </div>
       
      </div>

       <div className="grid grid-cols-3 gap-4 mb-8">
         <ExecutiveMetricCard density="analytical" label="Conectores Ativos" value="3" trend="up" />
         <ExecutiveMetricCard density="analytical" label="Na Fila" value={String(queue.length)} trend="neutral" />
         <ExecutiveMetricCard density="analytical" label="Publicados" value={String(queue.filter(q=>q.status==='PUBLISHED').length)} trend="up" />
       </div>

       <div className="mt-12 mb-8 border-t border-border pt-8" />
       <ExecutiveAccordion
         title="Pipeline de Ingestão e Fila de Revisão"
         subtitle="Conectores disponíveis, fila de staging e aprovação governada de dados."
         variant="analytics"
         defaultExpanded
       >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <ExecutiveHeading as="h3" className="text-h3 text-foreground">Conectores Disponíveis</ExecutiveHeading>
            <ConnectorRegistryPanel onSimulateUpload={handleSimulateUpload} />
            
            <div className="flex items-start gap-3 p-5 bg-warning-soft border border-warning/20 rounded-md text-warning">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div>
                <ExecutiveText as="div" variant="bodyStandard" className="mb-1">Nota de Governança (MVP)</ExecutiveText>
                <p className="text-[10px] text-warning/80 leading-relaxed">
                  Nenhum arquivo real sobe sem passar pelo Gateway. Simule a ingestão e acompanhe a Fila de Revisão.
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            <ExecutiveHeading as="h3" className="text-h3 text-foreground">Import Review Queue <span className="text-executive-secondary font-normal text-body-sm ml-2">(Staging)</span></ExecutiveHeading>
            <ImportReviewQueueTable
              queue={queue}
              onApprove={handleApprove}
              onPublish={handlePublish}
            />
          </div>
        </div>
        <ExecutiveSummarySection 
          status={{ label: 'Gateway Ativo', variant: 'success' }}
          question="Como a ingestão de dados garante a integridade fiduciária e a conformidade dos conectores?"
          opinion="O comitê fiduciário chancela os conectores integrados e a fila de staging como alfândega segura para recepção de dados."
          driver="Conectores de dados, fila de staging, validação fiduciária e homologação de publicação."
          implication="Eliminação de contaminação de dados brutos na base de governança."
          executiveQuestion="Auditar mensalmente as permissões e chaves de API dos conectores ativos."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
