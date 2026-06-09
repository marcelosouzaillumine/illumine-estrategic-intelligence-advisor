import React, { useState, useEffect, useMemo } from 'react';
import { GitBranchPlus, ShieldCheck, Activity } from 'lucide-react';
import { PageHeader } from '../../Common';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';
import { WorkflowBoard } from '../../workflow-governance/WorkflowBoard';
import { WorkflowAuditFeed } from '../../workflow-governance/WorkflowAuditFeed';

export function DecisionLifecycleCenter() {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'EXECUTIVE' | 'MASTER_AUDIT'>('EXECUTIVE');

  const mockTenant = 'TENANT-HQ';
  const mockWorkspace = 'WS-1';

  // Simulação de injeção da engine de causalidade
  const causalityGraph = useMemo(() => {
    return FiduciaryRuntimeAdapter.detectCrossStatementCausality(5000, -1000, 0, 6000, 0, 0);
  }, []);

  const loadState = () => {
    setWorkflows(FiduciaryRuntimeAdapter.DecisionRecordRegistry.getWorkflowsForTenant(mockTenant, mockWorkspace));
    setAuditLogs(FiduciaryRuntimeAdapter.WorkflowAuditLogger.getLogsForTenant(mockTenant));
  };

  useEffect(() => {
    loadState();
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Governança de Decisão"
          subtitle="Workflows Institucionais, Board Approvals e Trilhas de Causalidade."
          icon={GitBranchPlus}
          transparent
        />
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('EXECUTIVE')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'EXECUTIVE' ? 'bg-white text-muted-foreground shadow-sm' : 'text-muted-foreground hover:text-muted-foreground'
            }`}
          >
            <div className="flex items-center gap-2"><Activity size={14} /> Visão Executiva</div>
          </button>
          <button
            onClick={() => setActiveTab('MASTER_AUDIT')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'MASTER_AUDIT' ? 'bg-white text-muted-foreground shadow-sm' : 'text-muted-foreground hover:text-muted-foreground'
            }`}
          >
            <div className="flex items-center gap-2"><ShieldCheck size={14} /> Admin Master (Audit)</div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">
            {activeTab === 'EXECUTIVE' ? 'Decisões Causalmente Vinculadas' : 'Registro de Auditoria de Workflows'}
          </h3>
          <WorkflowBoard workflows={workflows} />
        </div>
        
        <div className="md:col-span-1 border-l border-border pl-8 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Trilha de Lineage</h3>
          <WorkflowAuditFeed logs={auditLogs} />
        </div>
      </div>
    </div>
  );
}
