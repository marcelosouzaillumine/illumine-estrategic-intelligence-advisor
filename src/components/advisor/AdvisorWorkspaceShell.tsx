import React from 'react';
import { AdvisorWorkspaceRuntime } from '../../core/advisor/AdvisorWorkspaceRuntime';
import { AdvisorContextEngine } from '../../core/advisor/AdvisorContextEngine';
import { PageHeader } from '../Common';
import { Compass, Briefcase, Network, Database } from 'lucide-react';
import { OrganizationPortfolioPanel } from './OrganizationPortfolioPanel';
import { AdvisorInstitutionalOverview } from './AdvisorInstitutionalOverview';
import { AdvisorInvestigationSurface } from './AdvisorInvestigationSurface';
import { AdvisorHistoricalSurface } from './AdvisorHistoricalSurface';
import { ExecutiveAdvisorDashboard } from './ExecutiveAdvisorDashboard';
import { useAdvisorWorkspaceShellViewModel } from '../../capabilities/executive/presentation/view-models/useAdvisorWorkspaceShellViewModel';

interface AdvisorWorkspaceShellProps {
  runtime: AdvisorWorkspaceRuntime;
  contextEngine: AdvisorContextEngine;
  advisorId: string;
  tenantId: string;
}

export const AdvisorWorkspaceShell: React.FC<AdvisorWorkspaceShellProps> = ({
  runtime,
  contextEngine,
  advisorId,
  tenantId
}) => {
  const { state, actions } = useAdvisorWorkspaceShellViewModel({
    runtime,
    contextEngine,
    advisorId,
    tenantId
  });

  const { portfolio, activeOrgId, insights, loading, activeOrg } = state;
  const { handleCrossNavigation, handleSelectOrganization } = actions;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Compass className="animate-spin-slow text-primary mb-4" size={32} />
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Sincronizando Governance OS...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Advisor Workspace"
          subtitle={activeOrg ? `Operando em: ${activeOrg.name}` : "Cockpit Operacional"}
          icon={Compass}
          transparent
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleCrossNavigation('INTELLIGENCE_FABRIC', '/intelligence/root')}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent text-accent text-sm font-display font-medium rounded-[12px] transition-colors border border-accent shadow-sm"
          >
            <Network size={16} />
            <span>Intelligence Fabric</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('WAR_ROOM', '/war-room')}
            className="flex items-center gap-2 px-4 py-2 bg-warning-soft0/10 hover:bg-warning-soft0/20 text-amber-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-amber-500/30 shadow-sm"
          >
            <span>Abrir War Room</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('MEMORY', '/memory')}
            className="flex items-center gap-2 px-4 py-2 bg-success-soft0/10 hover:bg-success-soft0/20 text-emerald-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-emerald-500/30 shadow-sm"
          >
            <Database size={16} />
            <span>Memória Institucional</span>
          </button>
        </div>
      </div>

      <ExecutiveAdvisorDashboard portfolio={portfolio} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Coluna 1: Carteira de Organizações */}
        <div className="xl:col-span-3 space-y-6">
          <OrganizationPortfolioPanel 
            portfolio={portfolio} 
            activeOrgId={activeOrgId} 
            onSelectOrganization={handleSelectOrganization} 
          />
        </div>

        {/* Coluna 2: Visão Institucional (Twin/ESGIM/Scenarios) */}
        <div className="xl:col-span-4 space-y-6">
          {activeOrg ? (
            <AdvisorInstitutionalOverview organization={activeOrg} insights={insights} />
          ) : (
            <div className="card-premium p-8 flex flex-col items-center justify-center text-center h-[400px]">
              <Briefcase size={32} className="text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground">Selecione uma organização na carteira para iniciar o diagnóstico.</p>
            </div>
          )}
        </div>

        {/* Coluna 3: Investigações Ativas */}
        <div className="xl:col-span-3 space-y-6">
          <AdvisorInvestigationSurface organizationId={activeOrgId} />
        </div>

        {/* Coluna 4: Histórico e Evolução */}
        <div className="xl:col-span-2 space-y-6">
          <AdvisorHistoricalSurface organizationId={activeOrgId} />
        </div>
        
      </div>
    </div>
  );
};
