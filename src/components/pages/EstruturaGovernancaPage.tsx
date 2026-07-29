import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { GovernanceRolesPanel } from './governance/GovernanceRolesPanel';
import { ResponsibilityMatrixPanel } from './governance/ResponsibilityMatrixPanel';
import { useEstruturaGovernancaPageViewModel } from '../../viewmodels/useEstruturaGovernancaPageViewModel';
import { StatusBadge } from '../Common';

export function EstruturaGovernancaPage(props?: any) {
  const { state } = useEstruturaGovernancaPageViewModel(props || ({} as any));

  return (
    <ExecutivePageTemplate
      header={{
        title: 'Estrutura de Governança Corporativa (EAA)',
        subtitle: 'Mapeamento Canônico de Papéis Executivos, Alçadas do Conselho e Matriz RACI',
        badge: 'EAA GOVERNANCE — L4 READY'
      }}
    >
      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Governança Ativa" />
          <StatusBadge status="Verde" label="Matriz RACI Mapeada" />
        </div>
      </div>

      <div className="space-y-8">
        {/* Painel de Papéis Executivos */}
        <GovernanceRolesPanel />

        {/* Matriz RACI de Responsabilidades */}
        <ResponsibilityMatrixPanel />
      </div>
    </ExecutivePageTemplate>
  );
}
