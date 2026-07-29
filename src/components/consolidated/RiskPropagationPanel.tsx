import React from 'react';
import { GitMerge } from 'lucide-react';
import { CrossEntityCausality } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { formatEntityName, formatCausalityLabel } from './ConsolidatedLanguageFormatter';

export function RiskPropagationPanel({ causalities }: { causalities: CrossEntityCausality[] }) {
  if (!causalities || causalities.length === 0) return null;

  return (
    <ExecutiveSurface className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center border border-amber-500/20">
          <GitMerge size={20} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
            Causalidade Estrutural
          </ExecutiveHeading>
          <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
            Mapeamento Causa-Efeito
          </ExecutiveText>
        </div>
      </div>
      
      <div className="space-y-4">
        {causalities.map((causal, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-border bg-muted/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <ExecutiveText variant="caption" className="font-bold uppercase text-slate-600 dark:text-slate-400">
                Origem: {formatEntityName(causal.primaryEntityId)}
              </ExecutiveText>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0 whitespace-nowrap">
                <ExecutiveText variant="caption" className="font-bold uppercase text-amber-700 dark:text-amber-400 whitespace-nowrap">
                  {formatCausalityLabel(causal.causalityType)}
                </ExecutiveText>
              </span>
            </div>
            <ExecutiveText variant="bodyStandard" className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {causal.description}
            </ExecutiveText>
            {causal.financialEvidence && (
              <div className="mt-2 bg-card p-2 rounded border border-border">
                <ExecutiveText variant="caption" className="text-slate-600 dark:text-slate-400">
                  <strong className="text-slate-900 dark:text-slate-100">Evidência:</strong> {causal.financialEvidence.metric} ({causal.financialEvidence.context})
                </ExecutiveText>
              </div>
            )}
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}

