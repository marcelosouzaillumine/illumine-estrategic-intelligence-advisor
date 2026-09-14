import React from 'react';
import { CognitiveDriverItem, CognitiveCausalStep } from '../../../../viewmodels/cognitive/ExecutiveCognitiveViewModel';
import { Network } from 'lucide-react';
import { InvestigationLauncherWrapper } from '../../../../components/investigation/InvestigationLauncherWrapper';

interface InstitutionalGraphViewerProps {
  primaryDrivers: CognitiveDriverItem[];
  causalPath: CognitiveCausalStep[];
}

export const InstitutionalGraphViewer: React.FC<InstitutionalGraphViewerProps> = ({ primaryDrivers, causalPath }) => {
  if (primaryDrivers.length === 0 && causalPath.length === 0) {
    return (
      <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
        <h3 className="text-sm font-bold text-foreground mb-1">Knowledge Graph Simplificado</h3>
        <p className="text-xs text-muted-foreground">
          Nenhuma topologia disponível.
        </p>
      </div>
    );
  }

  // A very simplified hardcoded layout that just lists nodes and edges sequentially
  // since dynamic D3/Vis algorithms are out of scope (no inference, no complex calc).

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
        <Network size={16} className="text-primary" />
        Topologia Causal
      </h3>
      
      <div className="p-4 bg-surface-container/30 border border-border rounded-xl flex flex-col items-center justify-center min-h-[150px]">
        <p className="text-xs text-muted-foreground mb-4 text-center max-w-[250px]">
          Grafo processado determinísticamente via CognitiveQueryEngine.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {causalPath.length > 0 ? (
            causalPath.map((step, idx) => (
              <React.Fragment key={step.stepId}>
                <div className="flex flex-col items-center gap-1">
                  <div className="px-3 py-1.5 border border-primary/30 bg-primary/5 rounded-full text-xs font-semibold text-primary">
                    {step.sourceNodeLabel}
                  </div>
                  <InvestigationLauncherWrapper 
                    tenantId="SYSTEM_TENANT" 
                    nodeId={step.sourceNodeId} 
                    originSurface="GRAPH_VIEWER" 
                  />
                </div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground flex items-center">
                  <span className="w-4 h-px bg-border"></span>
                  <span className="px-1">{step.relationshipType}</span>
                  <span className="w-4 h-px bg-border"></span>
                  <span className="text-border ml-[-2px]">&gt;</span>
                </div>
                {idx === causalPath.length - 1 && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="px-3 py-1.5 border border-primary/30 bg-primary/5 rounded-full text-xs font-semibold text-primary">
                      {step.targetNodeLabel}
                    </div>
                    <InvestigationLauncherWrapper 
                      tenantId="SYSTEM_TENANT" 
                      nodeId={step.targetNodeId} 
                      originSurface="GRAPH_VIEWER" 
                    />
                  </div>
                )}
              </React.Fragment>
            ))
          ) : (
             primaryDrivers.map((driver) => (
               <div key={driver.id} className="flex flex-col items-center gap-1">
                 <div className="px-3 py-1.5 border border-primary/30 bg-primary/5 rounded-full text-xs font-semibold text-primary">
                   {driver.title}
                 </div>
                 <InvestigationLauncherWrapper 
                   tenantId="SYSTEM_TENANT" 
                   nodeId={driver.id} 
                   originSurface="GRAPH_VIEWER" 
                 />
               </div>
             ))
          )}
        </div>
      </div>
    </div>
  );
};
