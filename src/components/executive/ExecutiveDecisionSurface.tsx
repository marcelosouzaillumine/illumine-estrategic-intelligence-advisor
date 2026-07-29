import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, TrendingUp } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';

export interface ExecutiveDecisionSurfaceProps {
  pageTitle: string;
  opportunityTitle?: string;
  opportunityDetail?: string;
  agentName?: string;
  onExploreAnalysis?: () => void;
}

export const ExecutiveDecisionSurface: React.FC<ExecutiveDecisionSurfaceProps> = ({
  pageTitle,
  opportunityTitle = 'Reduzir despesas comerciais em 8%',
  opportunityDetail = 'Despesas comerciais +18% no período',
  agentName = 'Financial Agent',
  onExploreAnalysis
}) => {
  return (
    <ExecutiveSurface variant="default" elevation="md" className="mb-6 rounded-2xl border border-blue-900/50 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <ExecutiveHeading as="h2" className="text-sm font-bold text-slate-100">{pageTitle} — Centro de Decisão Executiva</ExecutiveHeading>
        </div>
        <ExecutiveBadge variant="success" className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" /> Inteligência Ativa
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
          <ExecutiveText as="span" variant="caption" className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mb-1">
            <TrendingUp className="h-3 w-3" /> Oportunidade
          </ExecutiveText>
          <ExecutiveText as="p" variant="bodyStandard" className="text-xs font-bold text-slate-100">{opportunityTitle}</ExecutiveText>
        </div>

        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
          <ExecutiveText as="span" variant="caption" className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 mb-1">
            <ShieldAlert className="h-3 w-3" /> Base Analítica
          </ExecutiveText>
          <ExecutiveText as="p" variant="bodyStandard" className="text-xs text-slate-300">{opportunityDetail}</ExecutiveText>
        </div>

        <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800 flex items-center justify-between">
          <div>
            <ExecutiveText as="span" variant="caption" className="text-[11px] font-semibold text-blue-400 mb-1 block">Agente Âncora</ExecutiveText>
            <ExecutiveText as="p" variant="bodyStandard" className="text-xs font-bold text-slate-100">{agentName}</ExecutiveText>
          </div>
          {onExploreAnalysis && (
            <button
              onClick={onExploreAnalysis}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
            >
              <span>Explorar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </ExecutiveSurface>
  );
};
