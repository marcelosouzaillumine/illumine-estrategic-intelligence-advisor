import React from 'react';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { PortfolioExecutiveSummary } from './portfolio/PortfolioExecutiveSummary';
import { usePortfolioPageViewModel } from '../../viewmodels/usePortfolioPageViewModel';
import { StatusBadge } from '../Common';

export function PortfolioPage(props?: any) {
  const { state } = usePortfolioPageViewModel(props);

  return (
    <ExecutivePageTemplate
      header={{
        title: 'Gestão Estratégica de Portfólio (EAA)',
        subtitle: 'Consolidação de Ativos, Alocação de Capital e Exposição de Riscos da Holding',
        badge: 'PORTFOLIO EAA — L4 READY'
      }}
    >
      {/* Control Bar (Context Controls & Actions) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <StatusBadge status="Ativo" label="Portfólio Consolidado" />
          <StatusBadge status="Verde" label={`${state.activeAssetsCount} Ativos Monitorados`} />
        </div>
      </div>

      <div className="space-y-8">
        <PortfolioExecutiveSummary
          totalPortfolioValue={state.totalPortfolioValue}
          activeAssetsCount={state.activeAssetsCount}
        />
      </div>
    </ExecutivePageTemplate>
  );
}
