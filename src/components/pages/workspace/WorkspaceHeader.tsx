import React from 'react';
import { ExecutiveNarrative } from '../../ui/executive-narrative';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

interface WorkspaceHeaderProps {
  workspaceName: string;
  activeTenantId: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  workspaceName,
  activeTenantId
}) => {
  return (
    <div className="space-y-6">
      <ExecutiveNarrative variant="summary" title="WORKSPACE EXECUTIVO — Visão Consolidada 360º">
        Ambiente corporativo multi-tenant personalizado para tomada de decisão estratégica do cliente.
      </ExecutiveNarrative>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExecutiveMetricCard
          title="Workspace Ativo"
          value={workspaceName}
          statusBadge={`Tenant: ${activeTenantId}`}
          description="Ambiente isolado corporativo"
        />
        <ExecutiveMetricCard
          title="Score de Performance"
          value="98.5%"
          statusBadge="Nível L4 Auditado"
          description="Maturidade de governança"
        />
      </div>
    </div>
  );
};
