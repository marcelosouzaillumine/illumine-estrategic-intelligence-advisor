import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, TrendingUp, Compass } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';

export interface ExecutiveDecisionSurfaceProps {
  pageTitle: string;
  opportunityTitle?: string;
  opportunityDetail?: string;
  onExploreAnalysis?: () => void;
}

const PAGE_TITLE_MAP: Record<string, string> = {
  DashboardPage: 'Dashboard Executivo',
  DREPage: 'Demonstração do Resultado (DRE)',
  BalanceSheetPage: 'Balanço Patrimonial',
  DFCPage: 'Fluxo de Caixa (DFC)',
  DLPAPage: 'Lucros Acumulados (DLPA)',
  EFOSPage: 'Executive Financial Operating System (EFOS)'
};

export const ExecutiveDecisionSurface: React.FC<ExecutiveDecisionSurfaceProps> = ({
  pageTitle,
  opportunityTitle = 'Reduzir despesas comerciais e otimizar margem',
  opportunityDetail = 'Variação atípica identificada no período contábil.',
  onExploreAnalysis
}) => {
  const displayTitle = PAGE_TITLE_MAP[pageTitle] || pageTitle;

  return (
    <ExecutiveSurface variant="default" radius="lg" padding="lg" elevation="sm" className="mb-6 border-border">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-container text-secondary border border-border">
            <Sparkles className="h-4 w-4" />
          </div>
          <ExecutiveHeading as="h2" className="text-sm font-bold text-primary">
            Centro de Decisão Executiva — {displayTitle}
          </ExecutiveHeading>
        </div>
        <ExecutiveBadge variant="success" className="flex items-center gap-1">
          <TrendingUp className="h-3.5 w-3.5" /> Inteligência Ativa
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-surface-container p-4 border border-border">
          <ExecutiveText as="span" variant="caption" className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1.5">
            <TrendingUp className="h-3 w-3" /> Sinal / Oportunidade
          </ExecutiveText>
          <ExecutiveText as="p" variant="bodyStandard" className="text-xs font-bold text-primary leading-snug">
            {opportunityTitle}
          </ExecutiveText>
        </div>

        <div className="rounded-xl bg-surface-container p-4 border border-border">
          <ExecutiveText as="span" variant="caption" className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-1.5">
            <ShieldAlert className="h-3 w-3" /> Diagnóstico & Impacto
          </ExecutiveText>
          <ExecutiveText as="p" variant="bodyStandard" className="text-xs text-executive-secondary leading-snug">
            {opportunityDetail}
          </ExecutiveText>
        </div>

        <div className="rounded-xl bg-surface-container p-4 border border-border flex flex-col justify-between">
          <div>
            <ExecutiveText as="span" variant="caption" className="text-[11px] font-semibold text-secondary mb-1 flex items-center gap-1">
              <Compass className="h-3 w-3" /> Ação Recomendada
            </ExecutiveText>
            <ExecutiveText as="p" variant="bodyStandard" className="text-xs font-bold text-primary">
              Encaminhar orientação ao comitê executivo
            </ExecutiveText>
          </div>
          {onExploreAnalysis && (
            <button
              onClick={onExploreAnalysis}
              className="mt-3 flex items-center justify-center gap-1.5 w-full rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground hover:bg-secondary/90 transition-all shadow-sm"
            >
              <span>Explorar Decisão</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </ExecutiveSurface>
  );
};
