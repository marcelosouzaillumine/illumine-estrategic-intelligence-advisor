

import React, { useState, useEffect } from 'react';
import { GitBranchPlus, PlusCircle } from 'lucide-react';
import { PageHeader, StatusBadge } from '../../../../components/Common';
import { DecisionRecordRegistry } from '../../../../services/FiduciaryRuntimeAdapter';
import { WorkflowAuditLogger } from '../../../../services/FiduciaryRuntimeAdapter';
import { AlertResponseWorkflow } from '../../../../services/FiduciaryRuntimeAdapter';
import { DecisionLineageBinder } from '../../../../services/FiduciaryRuntimeAdapter';
import { WorkflowBoard } from '../../../../components/workflow-governance/WorkflowBoard';
import { WorkflowAuditFeed } from '../../../../components/workflow-governance/WorkflowAuditFeed';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useDecisionGovernancePageViewModel } from '../../../../viewmodels/useDecisionGovernancePageViewModel';

export function DecisionGovernancePage() {
  // Adapter: useDecisionGovernancePageAdapter
  // ViewModel: useDecisionGovernancePageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useDecisionGovernancePageViewModel();
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  const mockTenant = 'TENANT-HQ';
  const mockWorkspace = 'WS-1';
  const mockActor = { userId: 'USER-1', role: 'MASTER_ADMIN', name: 'Admin Institucional' };

  const loadState = () => {
    setWorkflows(DecisionRecordRegistry.getWorkflowsForTenant(mockTenant, mockWorkspace));
    setAuditLogs(WorkflowAuditLogger.getLogsForTenant(mockTenant));
  };

  useEffect(() => {
    loadState();
  }, []);

  const handleCreateMockWorkflow = () => {
    const lineage = DecisionLineageBinder.bind(mockTenant, mockWorkspace, { groupId: 'GROUP-A', reportVersion: '1.0' });
    AlertResponseWorkflow.initiateFromAlert('MOCK-ALERT-1', 'Alerta Mock de Liquidez', lineage, mockActor);
    loadState();
  };

  return (
    <ExecutivePageTemplate header={{
      title: "Governança de Decisão",
      description: "Workflows Institucionais, Board Approvals e Trilhas de Auditoria.",
    }}>

      {/* --- CAMADA 1: NÍVEL CONSELHO (SÍNTESE DE GOVERNANÇA DE DECISÃO) --- */}
      <ExecutiveSummarySection 
        className="mb-8"
        status={{ label: 'Decisões Rastreáveis', variant: 'success' }}
        question="Como garantir rastreabilidade imutável sobre decisões do conselho?"
        opinion="O comitê fiduciário chancela a esteira de aprovação de deliberações e a trilha de auditoria."
        driver="Workflows ativos, aprovadores designados, prazos de deliberação e registros de auditoria."
        implication="Mitigação de riscos de responsabilização fiduciária por decisões desprovidas de parecer técnico."
        executiveQuestion="Monitorar o backlog de deliberações pendentes no conselho."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Fluxos Ativos" />
        </div>
        <button
          onClick={handleCreateMockWorkflow}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0"
        >
          <PlusCircle size={15} />
          Simular Novo Workflow
        </button>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Quadro Kanban de Decisões Fiduciárias"
        subtitle="Monitore workflows corporativos, board approvals e as trilhas forenses de auditoria."
        variant="analytics"
        defaultExpanded
      >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Workflows Ativos</h3>
          <WorkflowBoard workflows={workflows} />
        </div>
        
        <div className="md:col-span-1 border-l border-border pl-8 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Trilha de Auditoria</h3>
          <WorkflowAuditFeed logs={auditLogs} />
        </div>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
