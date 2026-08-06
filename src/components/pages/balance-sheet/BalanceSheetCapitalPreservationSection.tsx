// @ts-nocheck
import React from 'react';
import { ExecutiveEvidenceGrid } from '../../ui/executive-evidence-grid';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveDiagnosticPanel } from '../../ui/executive-diagnostic-panel';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { AnalysisPanelViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';

export type BalanceSheetCapitalPreservationSectionProps = {
  panel: AnalysisPanelViewModel;
};

export const BalanceSheetCapitalPreservationSection = ({ panel }: BalanceSheetCapitalPreservationSectionProps) => {
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
    throw new Error('[BP Constitutional Violation] Required diagnostic panel missing in BalanceSheetCapitalPreservationSection.');
  }

  return (
    <div className="mb-10 animate-executive-fade relative">
      <ExecutiveSurface variant="default" elevation="sm" className="p-6 md:p-8 mb-6 rounded-[24px]">
        <ExecutiveDiagnosticPanel
          question="A estrutura financeira está preservando o valor investido ou destruindo a riqueza dos acionistas?"
          statusBadge={
            <ExecutiveBadge variant={panel.statusBadgeVariant}>
              {panel.statusLabel}
            </ExecutiveBadge>
          }
          observation={panel.observation}
          evidence={panel.evidence}
          financialMeaning={panel.financialMeaning}
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
