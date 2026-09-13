import React from 'react';
import { Network } from 'lucide-react';
import { KnowledgeGraphExplorer } from '../../../../components/knowledge-graph/KnowledgeGraphExplorer';
import { GraphQueryConsole } from '../../../../components/knowledge-graph/GraphQueryConsole';
import { SemanticLineageViewer } from '../../../../components/knowledge-graph/SemanticLineageViewer';
import { RiskCorrelationPanel } from '../../../../components/knowledge-graph/RiskCorrelationPanel';
import { WorkflowPatternPanel } from '../../../../components/knowledge-graph/WorkflowPatternPanel';
import { GovernanceRelationshipViewer } from '../../../../components/knowledge-graph/GovernanceRelationshipViewer';
import { OntologyRegistryViewer } from '../../../../components/knowledge-graph/OntologyRegistryViewer';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { StatusBadge } from '../../../../components/Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useInstitutionalKnowledgeGraphPageViewModel } from '../../../../viewmodels/useInstitutionalKnowledgeGraphPageViewModel';




export function InstitutionalKnowledgeGraphPage() {
  // Adapter: useInstitutionalKnowledgeGraphPageAdapter
  // ViewModel: useInstitutionalKnowledgeGraphPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalKnowledgeGraphPageViewModel({ clientId: '' });
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant
  
  return (
    <ExecutivePageTemplate header={{
      title: "Knowledge Graph Institucional",
      description: "Semantic Governance Layer. Explorador auditável de correlações fiduciárias e memória institucional.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Grafo Semântico Ativo" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Explorador de Ontologia e Relações"
        subtitle="Analise nós causais, relações de governança e memória semântica institucional."
        variant="analytics"
        defaultExpanded
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <KnowledgeGraphExplorer tenantId={tenantId} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RiskCorrelationPanel tenantId={tenantId} />
              <WorkflowPatternPanel tenantId={tenantId} />
            </div>
            
            <GovernanceRelationshipViewer tenantId={tenantId} />
            <OntologyRegistryViewer />
          </div>

          <div className="space-y-6">
            <GraphQueryConsole tenantId={tenantId} />
            <SemanticLineageViewer tenantId={tenantId} />
          </div>
        </div>
        <ExecutiveSummarySection 
          status={{ label: 'Grafo Conectado', variant: 'success' }}
          question="Como o Knowledge Graph estruturado suporta a memória institucional?"
          opinion="O comitê fiduciário homologa a ontologia e o mapeamento semântico como base para inferências de inteligência."
          driver="Ontologia corporativa, grafos de correlação, registros de linhagem e padrões de workflow."
          implication="Preservação da memória histórica e rastreabilidade total do conhecimento institucional."
          executiveQuestion="Manter atualizadas as ontologias setoriais e os registros de regras causais."
        >
          <ExecutiveStrategicTensions tensions={[]} />
          <ExecutiveDecisionTrace trace={[]} />
        </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
