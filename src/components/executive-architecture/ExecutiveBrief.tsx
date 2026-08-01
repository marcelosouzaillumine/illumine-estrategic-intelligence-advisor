import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveBriefViewModel } from '../../viewmodels/ExecutiveBriefPresenter';
import { ExecutiveBadge, ExecutiveBadgeVariant } from '../ui/executive-badge';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ShieldCheck, Activity, Target, Zap, AlertTriangle } from 'lucide-react';
import { DecisionNarrativePanel } from './DecisionNarrativePanel';
import { DecisionIntelligenceTrace } from './DecisionIntelligenceTrace';
import { ExecutiveConfidenceMap } from './ExecutiveConfidenceMap';
import { EvidenceIntegrityPanel } from './EvidenceIntegrityPanel';

export interface ExecutiveBriefProps {
  data: ExecutiveBriefViewModel;
  className?: string;
}

export function ExecutiveBrief({ data, className }: ExecutiveBriefProps) {
  return (
    <div className={cn("flex flex-col gap-12 w-full animate-executive-fade", className)}>
      
      {/* HEADER & CONTEXT */}
      <ExecutiveSurface variant="default" padding="lg" radius="lg" className="flex flex-col gap-6 w-full">
        <div className="flex justify-between items-start">
          <div>
            <ExecutiveText variant="microLabel" className="text-executive-muted uppercase tracking-widest mb-2">
              {data.header.title}
            </ExecutiveText>
            <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground">
              Sessão Cognitiva Ativa
            </ExecutiveHeading>
          </div>
          <ExecutiveBadge variant={data.header.statusVariant as ExecutiveBadgeVariant}>
            {data.header.statusBadge}
          </ExecutiveBadge>
        </div>
      </ExecutiveSurface>

      {/* LAYER 1: Conclusão Executiva (Narrative) */}
      <DecisionNarrativePanel blocks={data.narrative.blocks} />

      {/* LAYER 2: Por quê? (Decision Trace) */}
      <DecisionIntelligenceTrace 
        decision={data.decisionIntent.requestedDecision}
        assumptions={data.context.assumptions}
        evidenceTrail={data.evidenceTrail}
        recommendation={data.narrative.blocks.find(b => b.recommendation)?.recommendation || 'Verificar cenários.'}
      />

      {/* LAYER 3: Limites de Confiança (Confidence Map) */}
      {data.confidenceMap && (
        <ExecutiveConfidenceMap 
          confidenceMap={data.confidenceMap}
          decision={data.decisionIntent.requestedDecision}
          overallScore={data.context.confidence}
        />
      )}

      {/* LAYER 4: Integridade de Dados (Evidence Integrity) */}
      {data.dataQuality && (
        <EvidenceIntegrityPanel dataQuality={data.dataQuality} />
      )}

      {/* EXECUTION PLAN */}
      {data.execution.plan.length > 0 && (
        <div className="flex flex-col gap-6">
          <ExecutiveHeading as="h3" variant="submoduleTitle">Plano de Execução</ExecutiveHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.execution.plan.map((item) => (
               <div key={item.id} className="p-6 rounded-xl border border-border bg-white shadow-sm flex flex-col gap-4">
                 <div className="flex justify-between items-center">
                   <span className={cn("text-xs font-black px-2 py-1 rounded-md uppercase", 
                     item.priority === 'CRITICAL' ? "bg-red-100 text-red-700" :
                     item.priority === 'HIGH' ? "bg-amber-100 text-amber-700" :
                     "bg-slate-100 text-slate-700"
                   )}>
                     {item.priority}
                   </span>
                   <span className="text-xs text-executive-muted font-medium">{item.deadline}</span>
                 </div>
                 <p className="font-bold text-sm text-foreground">{item.action}</p>
                 <div className="mt-auto pt-4 border-t border-border">
                   <p className="text-xs text-executive-muted">Responsável: <span className="font-bold text-foreground">{item.owner}</span></p>
                 </div>
               </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
