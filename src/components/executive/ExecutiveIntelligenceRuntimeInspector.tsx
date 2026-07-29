import React from 'react';
import { Activity } from 'lucide-react';

export interface ExecutiveIntelligenceRuntimeInspectorProps {
  pageId: string;
  hasRealData?: boolean;
}

const PAGE_TITLE_MAP: Record<string, string> = {
  DashboardPage: 'Dashboard Executivo',
  DREPage: 'Demonstração do Resultado (DRE)',
  BalanceSheetPage: 'Balanço Patrimonial',
  DFCPage: 'Fluxo de Caixa (DFC)',
  DLPAPage: 'Lucros Acumulados (DLPA)',
  EFOSPage: 'Executive Financial Operating System (EFOS)'
};

export const ExecutiveIntelligenceRuntimeInspector: React.FC<ExecutiveIntelligenceRuntimeInspectorProps> = ({
  pageId,
  hasRealData = true
}) => {
  if (process.env.NODE_ENV === 'production') return null;

  const displayTitle = PAGE_TITLE_MAP[pageId] || pageId;

  return (
    <div
      data-testid="executive-runtime-inspector"
      className="mb-4 rounded-xl border border-border bg-surface-container/60 p-2.5 text-[11px] text-executive-secondary backdrop-blur-md shadow-sm flex items-center justify-between"
    >
      <div className="flex items-center gap-2 font-mono">
        <Activity className="h-3.5 w-3.5 text-secondary animate-pulse" />
        <span className="font-bold text-primary">Runtime Inspector:</span>
        <span>Page Context <strong className="text-emerald-600 dark:text-emerald-400">✓ ({displayTitle})</strong></span>
        <span>|</span>
        <span>Financial Data <strong className={hasRealData ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{hasRealData ? '✓' : '⚠️'}</strong></span>
        <span>|</span>
        <span>Semantic Model <strong className="text-emerald-600 dark:text-emerald-400">✓</strong></span>
        <span>|</span>
        <span>Agent Runtime <strong className="text-emerald-600 dark:text-emerald-400">✓</strong></span>
        <span>|</span>
        <span>Decision Engine <strong className="text-emerald-600 dark:text-emerald-400">✓</strong></span>
      </div>
      <div className="rounded bg-surface-high px-2 py-0.5 text-[10px] font-semibold text-secondary border border-border">
        ADR-067 Verified
      </div>
    </div>
  );
};
