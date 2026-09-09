import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ApprovalFlowCard } from './ApprovalFlowCard';
import { Workflow, PlayCircle, ShieldCheck, CheckSquare, Layers } from 'lucide-react';
import { ActionRegistryEngine } from '../../../../packages/intelligence/executive-workflow-intelligence/src/ActionRegistryEngine';

export interface ExecutiveWorkflowWorkspaceProps {
  readonly companyId?: string;
}

export const ExecutiveWorkflowWorkspace: React.FC<ExecutiveWorkflowWorkspaceProps> = ({
  companyId = 'empresa-demo'
}) => {
  const actionDefs = ActionRegistryEngine.getActionDefinitions();

  return (
    <div className="w-full space-y-6">
      {/* 1. Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Executive Workflow Governance</h1>
              <ExecutiveBadge variant="info" className="font-mono">EWI v1.0 Governed Engine</ExecutiveBadge>


            </div>
            <p className="text-xs text-muted-foreground">Sistema motor governado orquestrando execução empresarial com chancela de aprovação humana e ledger de confiança imutável.</p>
          </div>
        </div>
      </div>

      {/* 2. Approval Governance Card */}
      <ApprovalFlowCard />

      {/* 3. Action Registry & Workflow Mesh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            <h3 className="font-semibold text-sm">Institutional Action Catalog</h3>
          </div>
          <div className="space-y-2">
            {actionDefs.map((act) => (
              <div key={act.actionId} className="p-2.5 rounded bg-background/50 border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold text-foreground block">{act.title}</span>
                  <span className="text-muted-foreground text-[11px]">{act.description}</span>
                </div>
                <ExecutiveBadge variant={act.defaultRiskLevel === 'CRITICAL' ? 'critical' : act.defaultRiskLevel === 'HIGH' ? 'warning' : 'info'}>
                  {act.defaultRiskLevel}
                </ExecutiveBadge>
              </div>
            ))}
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" padding="md" radius="lg">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm">Executive Motor Loop</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-blue-400">Step 1:</span> Decision Command Envelope Ingestion
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-blue-400">Step 2:</span> Approval Governance Matrix Assessment
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-blue-400">Step 3:</span> Execution Permission Adapter Dispatch
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-blue-400">Step 4:</span> Executive Trust Ledger Imputable Trail
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 4. Audit Trail & Ledger Status */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Executive Trust Ledger active for company {companyId}</span>
          </div>
          <span>Domain Governance Registry v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
