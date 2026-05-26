import React from 'react';
import { Network } from 'lucide-react';
import { PageHeader } from '../Common';
import { KnowledgeGraphExplorer } from '../knowledge-graph/KnowledgeGraphExplorer';
import { GraphQueryConsole } from '../knowledge-graph/GraphQueryConsole';
import { SemanticLineageViewer } from '../knowledge-graph/SemanticLineageViewer';
import { RiskCorrelationPanel } from '../knowledge-graph/RiskCorrelationPanel';
import { WorkflowPatternPanel } from '../knowledge-graph/WorkflowPatternPanel';
import { GovernanceRelationshipViewer } from '../knowledge-graph/GovernanceRelationshipViewer';
import { OntologyRegistryViewer } from '../knowledge-graph/OntologyRegistryViewer';

export function InstitutionalKnowledgeGraphPage() {
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant
  
  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Institutional Knowledge Graph"
        subtitle="Semantic Intelligence Layer. Explorador auditável de correlações fiduciárias e memória institucional."
        icon={Network}
        transparent
      />

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
    </div>
  );
}
