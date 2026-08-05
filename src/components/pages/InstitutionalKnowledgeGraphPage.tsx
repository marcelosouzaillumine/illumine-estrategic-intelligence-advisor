import React from 'react';
import { Network } from 'lucide-react';
import { KnowledgeGraphExplorer } from '../knowledge-graph/KnowledgeGraphExplorer';
import { GraphQueryConsole } from '../knowledge-graph/GraphQueryConsole';
import { SemanticLineageViewer } from '../knowledge-graph/SemanticLineageViewer';
import { RiskCorrelationPanel } from '../knowledge-graph/RiskCorrelationPanel';
import { WorkflowPatternPanel } from '../knowledge-graph/WorkflowPatternPanel';
import { GovernanceRelationshipViewer } from '../knowledge-graph/GovernanceRelationshipViewer';
import { OntologyRegistryViewer } from '../knowledge-graph/OntologyRegistryViewer';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { StatusBadge } from '../Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useInstitutionalKnowledgeGraphPageViewModel } from '../../viewmodels/useInstitutionalKnowledgeGraphPageViewModel';




export function InstitutionalKnowledgeGraphPage() {
  // Adapter: useInstitutionalKnowledgeGraphPageAdapter
  // ViewModel: useInstitutionalKnowledgeGraphPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalKnowledgeGraphPageViewModel({ clientId: '' });
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant
  
  return (
    <ExecutivePageTemplate header={{
      title: "Knowledge Graph Institucional",
      description: "Semantic Intelligence Layer. Explorador auditável de correlações fiduciárias e memória institucional.",
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
