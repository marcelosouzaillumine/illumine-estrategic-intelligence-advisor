import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { ExecutiveDecisionMemo } from '../../ui/executive-decision-memo';
import { ExecutiveDecisionSummary } from '../../ui/executive-decision-summary';
import { ExecutiveRecommendationBlock } from '../../ui/executive-recommendation-block';
import { DREBoardDecisionSupportViewModel } from './view-models';

interface Props {
  viewModel?: DREBoardDecisionSupportViewModel;
}

export function DREBoardDecisionSupportSection({ viewModel }: Props) {
  if (!viewModel) return null;

  return (
    <div className="mb-10">
      <ExecutiveDecisionMemo
        icon={<ShieldAlert />}
        title="Parecer Executivo para o Conselho"
        subtitle="Diagnóstico Executivo Diretivo"
        narrative={
          <div className="flex flex-col gap-8 w-full">
            <ExecutiveDecisionSummary
              label="P1 — Criação de Valor"
              theme="A empresa cria ou destrói valor?"
              reasonLabel="Avaliação"
              reason={
                <span className={viewModel.valueCreationTone === 'success' ? 'text-emerald-600' : 'text-rose-600'}>
                  {viewModel.valueCreationLabel}
                </span>
              }
              severityLabel="Status"
              severityTone={viewModel.valueCreationTone === 'success' ? 'success' : 'critical'}
            />
            
            <ExecutiveDecisionSummary
              label="P2 — Sustentação"
              theme="O faturamento sustenta a estrutura?"
              reasonLabel="Avaliação"
              reason={viewModel.sustainabilityLabel}
              severityLabel="Status"
              severityTone="neutral"
            />

            <ExecutiveDecisionSummary
              label="P3 — Equilíbrio"
              theme="Quanto falta para o equilíbrio?"
              reasonLabel="Avaliação"
              reason={viewModel.balanceGapLabel}
              severityLabel="Status"
              severityTone="neutral"
            />

            <ExecutiveDecisionSummary
              label="P4 — Restrição"
              theme="Qual é a principal restrição econômica?"
              reasonLabel="Avaliação"
              reason={viewModel.primaryConstraintLabel}
              severityLabel="Status"
              severityTone="warning"
            />

            <ExecutiveDecisionSummary
              label="P5 — Oportunidade"
              theme="Qual é a principal oportunidade econômica?"
              reasonLabel="Avaliação"
              reason={<span className="text-emerald-600">{viewModel.primaryOpportunityLabel}</span>}
              severityLabel="Status"
              severityTone="success"
            />

            <ExecutiveDecisionSummary
              label="P6 — Inação"
              theme="Se nada for feito, o que acontece?"
              reasonLabel="Consequência"
              reason={
                <span className={viewModel.inactionTone === 'success' ? 'text-emerald-600' : 'text-rose-600'}>
                  {viewModel.inactionConsequenceLabel}
                </span>
              }
              severityLabel="Risco"
              severityTone={viewModel.inactionTone === 'success' ? 'success' : 'critical'}
            />

            <ExecutiveRecommendationBlock title="P7 — Prioridade do Conselho">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-foreground">Qual é a prioridade estratégica?</span>
                <span className="text-blue-600 font-medium">{viewModel.boardPriorityLabel}</span>
              </div>
            </ExecutiveRecommendationBlock>
          </div>
        }
      />
    </div>
  );
}
