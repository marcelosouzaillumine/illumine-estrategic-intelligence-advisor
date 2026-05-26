import React, { useState, useEffect } from 'react';
import { GitBranchPlus, PlusCircle } from 'lucide-react';
import { PageHeader } from '../Common';
import { DecisionRecordRegistry } from '../../core/runtime/workflow-governance/DecisionRecordRegistry';
import { WorkflowAuditLogger } from '../../core/runtime/workflow-governance/WorkflowAuditLogger';
import { AlertResponseWorkflow } from '../../core/runtime/workflow-governance/AlertResponseWorkflow';
import { DecisionLineageBinder } from '../../core/runtime/workflow-governance/DecisionLineageBinder';
import { WorkflowBoard } from '../workflow-governance/WorkflowBoard';
import { WorkflowAuditFeed } from '../workflow-governance/WorkflowAuditFeed';

export function DecisionGovernancePage() {
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Governança de Decisão"
          subtitle="Workflows Institucionais, Board Approvals e Trilhas de Auditoria."
          icon={GitBranchPlus}
          transparent
        />
        <button
          onClick={handleCreateMockWorkflow}
          className="btn-executive flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={15} />
          Simular Novo Workflow
        </button>
      </div>

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
    </div>
  );
}
