import React from 'react';
import { CognitiveDriverItem, CognitiveCausalStep } from '../../viewmodels/cognitive/ExecutiveCognitiveViewModel';
import { GitMerge, ArrowRight } from 'lucide-react';
import { useCognitiveNavigation } from '../../context/cognitive-navigation/CognitiveNavigationContext';
import { InvestigationLauncherWrapper } from '../investigation/InvestigationLauncherWrapper';

interface ExplainabilityDetailPanelProps {
  primaryDrivers: CognitiveDriverItem[];
  causalPath: CognitiveCausalStep[];
}

export const ExplainabilityDetailPanel: React.FC<ExplainabilityDetailPanelProps> = ({ primaryDrivers, causalPath }) => {
  const { navigateNode } = useCognitiveNavigation();

  if (!primaryDrivers || primaryDrivers.length === 0) {
    return (
      <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
        <h3 className="text-sm font-bold text-foreground mb-1">Explicabilidade Causal</h3>
        <p className="text-xs text-muted-foreground">
          Nenhuma cadeia causal disponível para este contexto.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Drivers Primários</h3>
        <div className="space-y-2">
          {primaryDrivers.map((driver) => (
            <div key={driver.id} className="p-3 bg-surface-container/50 border border-border rounded-lg flex items-start gap-3">
              <div className="mt-0.5">
                <GitMerge className="text-primary" size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{driver.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-muted-foreground bg-surface-container px-1.5 py-0.5 rounded">
                    {driver.type}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                    {driver.relationType}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <InvestigationLauncherWrapper 
                  tenantId="SYSTEM_TENANT" 
                  nodeId={driver.id} 
                  originSurface="COGNITIVE_DRAWER" 
                />
                <button 
                  onClick={() => navigateNode(driver.id)}
                  className="text-[10px] uppercase tracking-widest text-primary hover:text-primary/80 font-bold px-2 py-1 rounded bg-primary/10 transition-colors"
                >
                  Explorar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {causalPath && causalPath.length > 0 && (
        <div className="pt-2 border-t border-border">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-3">Trajetória Lógica</h3>
          <div className="space-y-0 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {causalPath.map((step, idx) => (
              <div key={step.stepId} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active py-2">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border bg-card shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 ml-0 md:ml-auto md:mr-auto">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] p-2 rounded-lg border border-border bg-surface-container/50 shadow-sm ml-4 md:ml-0">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono mb-1">
                    <span>{step.relationshipType}</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">{step.sourceNodeLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
