import React from 'react';
import { ExecutiveDashboardState, KPIView, PriorityView, ScenarioView, NarrativeViewBlock } from '../../../packages/shell/executive-intelligence-layer/src/presentation/ExecutiveDashboardState';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';
import { ExecutiveBadge, ExecutiveBadgeVariant } from './executive-badge';
import { cn } from '../../lib/utils';
import { ShieldAlert, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

export function ExecutiveDashboardRenderer({ model }: { model: ExecutiveDashboardState }) {
  if (!model) return null;

  return (
    <div className="flex flex-col gap-12 w-full animate-executive-fade mt-8">
      
      {/* HEADER */}
      <ExecutiveSurface variant="default" padding="lg" radius="lg" className="flex flex-col gap-6 w-full">
        <div className="flex justify-between items-start">
          <div>
            <ExecutiveText variant="microLabel" className="text-executive-muted uppercase tracking-widest mb-2">
              {model.header.title}
            </ExecutiveText>
            <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground">
              {model.header.subtitle}
            </ExecutiveHeading>
            <ExecutiveText variant="bodyStandard" className="mt-2 text-executive-muted">
              {model.header.contextDescription}
            </ExecutiveText>
          </div>
          <ExecutiveBadge variant={model.header.statusVariant as ExecutiveBadgeVariant}>
            {model.header.statusBadge}
          </ExecutiveBadge>
        </div>
      </ExecutiveSurface>

      {/* PRIORITIES / OPPORTUNITIES */}
      {model.priorities.length > 0 && (
        <div className="flex flex-col gap-6">
          <ExecutiveHeading as="h3" variant="submoduleTitle">Prioridades Executivas</ExecutiveHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {model.priorities.map(priority => (
              <ExecutiveSurface key={priority.id} className={cn(
                "flex flex-col gap-4 border-l-4",
                priority.type === 'ALERT' ? 'border-l-critical' : priority.type === 'ACTION' ? 'border-l-warning' : 'border-l-success'
              )}>
                <div className="flex justify-between items-center">
                  <span className={cn("text-xs font-black px-2 py-1 rounded-md uppercase",
                     priority.priorityLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                  )}>
                    {priority.priorityLevel}
                  </span>
                  {priority.type === 'ALERT' && <ShieldAlert className="text-critical w-5 h-5" />}
                  {priority.type === 'OPPORTUNITY' && <TrendingUp className="text-success w-5 h-5" />}
                </div>
                <h4 className="font-bold text-lg text-foreground">{priority.title}</h4>
                <p className="text-sm text-executive-muted">{priority.description}</p>
                <div className="mt-auto pt-4 border-t border-border">
                  <span className="text-xs font-semibold text-foreground">Contexto: {priority.actionableContext}</span>
                </div>
              </ExecutiveSurface>
            ))}
          </div>
        </div>
      )}

      {/* SCENARIOS */}
      {model.scenarios.length > 0 && (
        <div className="flex flex-col gap-6">
          <ExecutiveHeading as="h3" variant="submoduleTitle">Cenários Permitidos</ExecutiveHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {model.scenarios.map(scenario => (
              <ExecutiveSurface key={scenario.id} className="flex flex-col gap-4">
                <h4 className="font-bold text-lg text-foreground">{scenario.name}</h4>
                <p className="text-sm text-executive-muted">{scenario.description}</p>
                <div className="bg-slate-50 rounded-md p-4">
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Etapas Mapeadas</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {scenario.steps.map((step, idx) => (
                      <li key={idx} className="text-sm text-slate-700">{step}</li>
                    ))}
                  </ul>
                </div>
              </ExecutiveSurface>
            ))}
          </div>
        </div>
      )}

      {/* NARRATIVE BLOCKS */}
      <div className="flex flex-col gap-6">
        <ExecutiveHeading as="h3" variant="submoduleTitle">Narrativa Fiduciária</ExecutiveHeading>
        {model.narrative.map((block, idx) => (
          <ExecutiveSurface key={idx} className="flex flex-col gap-3">
             <div className="flex items-center gap-2">
                {block.priority === 'CRITICAL' && <AlertTriangle className="text-critical w-4 h-4" />}
                <h4 className="font-bold text-foreground">{block.title}</h4>
             </div>
             <p className="text-sm text-slate-700">{block.body}</p>
             {block.recommendation && (
               <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100 flex gap-2">
                 <Lightbulb className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                 <p className="text-xs text-blue-800 leading-relaxed font-medium">{block.recommendation}</p>
               </div>
             )}
          </ExecutiveSurface>
        ))}
      </div>

    </div>
  );
}
