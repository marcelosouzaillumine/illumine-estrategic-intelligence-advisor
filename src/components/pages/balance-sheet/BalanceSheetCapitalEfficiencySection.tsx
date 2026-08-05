// @ts-nocheck
import React from 'react';
import { ExecutiveEvidenceGrid } from '../../ui/executive-evidence-grid';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveDecisionPanel } from '../../ui/executive-decision-panel';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { AnalysisPanelViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';

export type BalanceSheetCapitalEfficiencySectionProps = {
  panel: AnalysisPanelViewModel;
};

export const BalanceSheetCapitalEfficiencySection = ({ panel }: BalanceSheetCapitalEfficiencySectionProps) => {
  const forbidden = [
    "Painel não gerado",
    "Erro Estrutural",
    "Aguardando evidências",
    "Omitido do contexto",
    "Dados Insuficientes",
    "Dados Indisponíveis",
    "Indeterminada",
    "Indeterminado"
  ];
  if (panel && forbidden.some(term => JSON.stringify(panel).includes(term))) {
    throw new Error("[BP Constitutional Violation] Panel contains forbidden synthetic placeholders.");
  }

  if (!panel) {
    throw new Error('[BP Constitutional Violation] Required decision panel missing in BalanceSheetCapitalEfficiencySection.');
  }

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveSurface variant="default" elevation="sm" className="p-6 md:p-8 mb-6 rounded-[24px]">
        <ExecutiveDecisionPanel
          question="O patrimônio está gerando retorno adequado ou há excesso de capital improdutivo?"
          statusBadge={
            <ExecutiveBadge variant={panel.statusBadgeVariant}>
              {panel.statusLabel}
            </ExecutiveBadge>
          }
          opinion={panel.opinion}
          driver={panel.driver}
          implication={panel.implication}
          executiveQuestion={panel.executiveQuestion}
          confidence={panel.confidence}
          technicalIndex={panel.score}
        />
      </ExecutiveSurface>
      {panel.evidences.length > 0 && (
        <ExecutiveEvidenceGrid metrics={panel.evidences as any} />
      )}
    </div>
  );
};
