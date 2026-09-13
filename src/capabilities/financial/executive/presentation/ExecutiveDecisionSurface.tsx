import React from 'react';
import { Sparkles, ArrowRight, ShieldAlert, TrendingUp, Compass } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

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
        <ExecutiveSurface variant="default" radius="md" padding="md" className="flex flex-col justify-between">
          <div>
            <ExecutiveText variant="microLabel" className="text-success flex items-center gap-1 mb-2">
              <TrendingUp className="h-3.5 w-3.5" /> Sinal / Oportunidade
            </ExecutiveText>
            <ExecutiveText variant="bodyStandard" className="font-bold text-foreground">
              {opportunityTitle}
            </ExecutiveText>
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" radius="md" padding="md" className="flex flex-col justify-between">
          <div>
            <ExecutiveText variant="microLabel" className="text-warning flex items-center gap-1 mb-2">
              <ShieldAlert className="h-3.5 w-3.5" /> Diagnóstico & Impacto
            </ExecutiveText>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              {opportunityDetail}
            </ExecutiveText>
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" radius="md" padding="md" className="flex flex-col justify-between">
          <div>
            <ExecutiveText variant="microLabel" className="text-secondary flex items-center gap-1 mb-2">
              <Compass className="h-3.5 w-3.5" /> Ação Recomendada
            </ExecutiveText>
            <ExecutiveText variant="bodyStandard" className="font-bold text-foreground">
              Encaminhar orientação ao comitê executivo
            </ExecutiveText>
          </div>
          {onExploreAnalysis && (
            <button
              onClick={onExploreAnalysis}
              className="mt-4 flex items-center justify-center gap-2 w-full rounded-md bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/90 transition-all shadow-sm"
            >
              <span>Explorar Decisão</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </ExecutiveSurface>
      </div>
    </ExecutiveSurface>
  );
};
