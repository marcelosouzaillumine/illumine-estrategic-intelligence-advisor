import React, { useState, useEffect } from 'react';
import { GitBranchPlus, PlusCircle } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <GitBranchPlus className="text-primary" />
            Governança de Decisão
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Workflows Institucionais, Board Approvals e Trilhas de Auditoria.
          </p>
        </div>
        
        <button
          onClick={handleCreateMockWorkflow}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <PlusCircle size={16} fill="currentColor" />
          Simular Novo Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-foreground mb-4">Workflows Ativos</h3>
          <WorkflowBoard workflows={workflows} />
        </div>
        
        <div className="md:col-span-1 border-l border-border pl-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Trilha de Auditoria Institucional</h3>
          <WorkflowAuditFeed logs={auditLogs} />
        </div>
      </div>
    </div>
  );
}
