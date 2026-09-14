import React from 'react';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { WorkspaceHeader } from '../../../../components/pages/workspace/WorkspaceHeader';
import { useClientExecutiveWorkspaceViewModel } from '../../../../viewmodels/useClientExecutiveWorkspaceViewModel';
import { StatusBadge } from '../../../../components/Common';

export function ClientExecutiveWorkspace(props?: any) {
  const { state } = useClientExecutiveWorkspaceViewModel(props);

  return (
    <ExecutivePageTemplate
      header={{
        title: 'Portal Executivo do Cliente (EAA & Workspace)',
        subtitle: 'Visão Integrada de Desempenho, Riscos, Recomendações e IA Estratégica',
        badge: 'WORKSPACE EAA — L4 READY'
      }}
    >
      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Workspace Executivo Ativo" />
          <StatusBadge status="Verde" label={state.workspaceName || 'Portal Homologado'} />
        </div>
      </div>

      <div className="space-y-8">
        <WorkspaceHeader
          workspaceName={state.workspaceName}
          activeTenantId={state.activeTenantId}
        />
      </div>
    </ExecutivePageTemplate>
  );
}
