import React from 'react';
import { Briefcase } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { DREExecutiveAdvisorySectionViewModel } from './view-models';
import { ExecutiveDecisionMemo } from '../../ui/executive-decision-memo';
import { ExecutiveNarrative } from '../../ui/executive-narrative';

interface Props {
  viewModel?: DREExecutiveAdvisorySectionViewModel;
}

export function DREExecutiveAdvisorySection({ viewModel }: Props) {
  const { t } = useLanguage();

  if (!viewModel) return null;

  return (
    <div className="mb-10">
      <ExecutiveDecisionMemo
        icon={<Briefcase />}
        title={t('dre.advisory.title')}
        subtitle={t('dre.advisory.subtitle')}
        thesis={viewModel.hasFullAdvisory ? "Síntese Estratégica da Demonstração de Resultados" : undefined}
        narrative={
          viewModel.hasFullAdvisory ? (
            <div className="flex flex-col gap-6 mt-2 w-full">
              {viewModel.situacaoAtual && (
                <ExecutiveNarrative variant="summary" title="Situação Atual">
                  {viewModel.situacaoAtual}
                </ExecutiveNarrative>
              )}
              {viewModel.restricaoPrincipal && (
                <ExecutiveNarrative variant="risk" title="Principal Restrição">
                  {viewModel.restricaoPrincipal}
                </ExecutiveNarrative>
              )}
              {viewModel.oportunidadePrincipal && (
                <ExecutiveNarrative variant="insight" title="Principal Oportunidade">
                  {viewModel.oportunidadePrincipal}
                </ExecutiveNarrative>
              )}
              {viewModel.prioridadeEstrategica && (
                <ExecutiveNarrative variant="board-note" title="Prioridade Estratégica">
                  {viewModel.prioridadeEstrategica}
                </ExecutiveNarrative>
              )}
              {viewModel.outlook && (
                <ExecutiveNarrative variant="summary" title="Perspectiva">
                  {viewModel.outlook}
                </ExecutiveNarrative>
              )}
            </div>
          ) : (
            <ExecutiveNarrative variant="summary">
              {viewModel.simpleAdvisoryText}
            </ExecutiveNarrative>
          )
        }
      />
    </div>
  );
}
