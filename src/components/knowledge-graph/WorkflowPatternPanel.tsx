import React from 'react';
import { WorkflowPatternAnalyzer } from '../../core/runtime/knowledge-graph/WorkflowPatternAnalyzer';
import { ActivitySquare } from 'lucide-react';

export function WorkflowPatternPanel({ tenantId }: { tenantId: string }) {
  const patterns = WorkflowPatternAnalyzer.analyzePatterns(tenantId);

  if (patterns.length === 0) return null;

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ActivitySquare className="text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Workflow Institutional Patterns</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map(p => (
          <div key={p.patternId} className="bg-background p-3 rounded border border-border">
            <div className="text-sm font-bold text-foreground mb-1">{p.workflowType}</div>
            <div className="text-xs text-muted-foreground">Frequência: {p.frequency} ocorrências</div>
            <div className="text-xs text-muted-foreground">Tempo Médio (Aprovação): {Math.round(p.averageApprovalTimeMs / 3600000)}h</div>
            <div className="mt-2">
               <span className="text-[10px] bg-primary/10 text-primary uppercase font-bold tracking-widest px-2 py-0.5 rounded border border-primary/20">
                 {p.criticality}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
