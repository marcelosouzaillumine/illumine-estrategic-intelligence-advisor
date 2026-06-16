import React from 'react';
import { DecisionPanelViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';
import { ExecutiveEvidenceGrid } from '../../ui/executive-evidence-grid';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveDecisionPanel } from '../../ui/executive-decision-panel';
import { ExecutiveSurface } from '../../ui/executive-surface';

export type BalanceSheetAssetQualitySectionProps = {
  panel?: DecisionPanelViewModel;
};

export const BalanceSheetAssetQualitySection = ({ panel }: BalanceSheetAssetQualitySectionProps) => {
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
    throw new Error('[BP Constitutional Violation] Required decision panel missing in BalanceSheetAssetQualitySection.');
  }

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveSurface variant="default" elevation="sm" className="p-6 md:p-8 mb-6 rounded-[24px]">
        <ExecutiveDecisionPanel
          question="O capital está imobilizado em excesso ou alocado eficientemente?"
          statusBadge={
            <ExecutiveBadge variant={panel.statusBadgeVariant}>
              {panel.statusLabel}
            </ExecutiveBadge>
          }
          opinion={panel.opinion}
          driver={panel.driver}
          implication={panel.implication}
          action={panel.action}
          confidence={panel.confidence}
          technicalIndex={panel.score}
        />
      </ExecutiveSurface>
      {panel.evidences && panel.evidences.length > 0 && (
        <ExecutiveEvidenceGrid metrics={panel.evidences as any} />
      )}
    </div>
  );
};
