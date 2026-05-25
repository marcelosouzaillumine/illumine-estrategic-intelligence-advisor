import React from 'react';
import { Network } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Network className="text-primary" />
            Institutional Knowledge Graph
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Semantic Intelligence Layer. Explorador auditável de correlações fiduciárias e memória institucional.
          </p>
        </div>
      </div>

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
