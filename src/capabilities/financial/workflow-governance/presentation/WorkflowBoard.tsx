import React from 'react';
import { DecisionWorkflow } from '../../../../services/FiduciaryRuntimeAdapter';
import { WorkflowStatusBadge } from './WorkflowStatusBadge';
import { useExecutiveFormatter } from "../../../../core/localization";

export function WorkflowBoard({ workflows }: { workflows: DecisionWorkflow[] }) {
    const formatter = useExecutiveFormatter();
  if (workflows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface-container border border-border rounded-xl text-muted-foreground h-full">
        <p className="text-sm">Nenhum Workflow Institucional ativo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workflows.map(wf => (
        <div key={wf.workflowId} className="p-4 bg-background border border-border rounded-lg shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-foreground">{wf.title}</h4>
            <WorkflowStatusBadge status={wf.status} />
          </div>
          <p className="text-xs text-muted-foreground mb-3">{wf.description}</p>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
            <span>ID: {wf.workflowId}</span>
            <span>Type: {wf.type}</span>
            <span>Created: {formatter.date(wf.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
