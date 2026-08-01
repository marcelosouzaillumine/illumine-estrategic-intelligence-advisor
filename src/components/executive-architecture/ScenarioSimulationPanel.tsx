import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { GitBranch, ArrowUpCircle, ArrowDownCircle, MinusCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { StrategicScenario } from '../../../packages/intelligence/executive-intelligence-layer/src/governance/DecisionRecord';

interface ScenarioSimulationPanelProps {
  scenarios: StrategicScenario[];
}

export function ScenarioSimulationPanel({ scenarios }: ScenarioSimulationPanelProps) {
  if (!scenarios || scenarios.length === 0) return null;

  return (
    <ExecutiveSurface variant="default" padding="xl" radius="xl" className="border border-border">
      <div className="flex items-center gap-2 mb-6">
        <GitBranch size={18} className="text-executive-primary" />
        <ExecutiveHeading as="h4" className="text-foreground tracking-widest uppercase text-sm">
          Strategic Scenario Simulator™
        </ExecutiveHeading>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div 
            key={scenario.id} 
            className={cn(
              "flex flex-col rounded-xl border p-5 transition-all relative overflow-hidden",
              scenario.isRecommended 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-border bg-surface-container/20"
            )}
          >
            {scenario.isRecommended && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={12} /> RECOMENDADO
              </div>
            )}
            
            <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase mb-1">
              {scenario.name}
            </ExecutiveText>
            <ExecutiveHeading as="h5" className="text-foreground mb-4 text-base">
              {scenario.action}
            </ExecutiveHeading>
            
            <div className="mt-auto space-y-3 pt-4 border-t border-border/50">
              <ExecutiveText variant="caption" className="text-muted-foreground uppercase block mb-2">
                Impacto Projetado
              </ExecutiveText>
              
              {scenario.impacts.map((impact, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{impact.metric}</span>
                  <div className="flex items-center gap-1.5">
                    {impact.direction === 'up' && <ArrowUpCircle size={14} className="text-success" />}
                    {impact.direction === 'down' && <ArrowDownCircle size={14} className="text-critical" />}
                    {impact.direction === 'neutral' && <MinusCircle size={14} className="text-muted-foreground" />}
                    <span className={cn(
                      "text-sm font-bold",
                      impact.direction === 'up' ? "text-success" : 
                      impact.direction === 'down' ? "text-critical" : "text-muted-foreground"
                    )}>
                      {impact.magnitude}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}
