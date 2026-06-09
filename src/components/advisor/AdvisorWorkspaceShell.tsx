import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdvisorWorkspaceRuntime } from '../../core/advisor/AdvisorWorkspaceRuntime';
import { AdvisorWorkspaceViewModel, UIOrganizationPortfolioItem, UIAdvisorInsight } from '../../viewmodels/advisor/AdvisorWorkspaceViewModel';
import { PageHeader } from '../Common';
import { Compass, Briefcase, Search, History, LayoutDashboard, Database, Network } from 'lucide-react';
import { OrganizationPortfolioPanel } from './OrganizationPortfolioPanel';
import { AdvisorInstitutionalOverview } from './AdvisorInstitutionalOverview';
import { AdvisorInvestigationSurface } from './AdvisorInvestigationSurface';
import { AdvisorHistoricalSurface } from './AdvisorHistoricalSurface';
import { ExecutiveAdvisorDashboard } from './ExecutiveAdvisorDashboard';
import { AdvisorContextEngine } from '../../core/advisor/AdvisorContextEngine';

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
  const navigate = useNavigate();

  const handleCrossNavigation = (targetWorkspace: string, path: string) => {
    const navRef = {
      tenantId: 'SYSTEM_TENANT',
      sourceWorkspace: 'ADVISOR',
      targetWorkspace,
      correlationId: `nav-${Date.now()}`
    };
    navigate(path, { state: { navRef } });
  };

  const [portfolio, setPortfolio] = useState<UIOrganizationPortfolioItem[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [insights, setInsights] = useState<UIAdvisorInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      try {
        const workspace = await runtime.loadWorkspaceState(advisorId, tenantId);
        const orgs = await runtime.loadPortfolio(tenantId);
        
        if (!active) return;

        setPortfolio(AdvisorWorkspaceViewModel.adaptPortfolio(orgs));

        if (workspace?.activeOrganizationId) {
          setActiveOrgId(workspace.activeOrganizationId);
          const { insights: rawInsights } = await runtime.loadOrganizationContext(tenantId, workspace.activeOrganizationId);
          if (active) {
            setInsights(AdvisorWorkspaceViewModel.adaptInsights(rawInsights));
          }
        }
      } catch (err) {
        console.error("Advisor Workspace failed to load:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [runtime, advisorId, tenantId]);

  const handleSelectOrganization = async (orgId: string) => {
    await contextEngine.switchOrganization(advisorId, tenantId, orgId);
    setActiveOrgId(orgId);
    // Recarregar insights
    const { insights: rawInsights } = await runtime.loadOrganizationContext(tenantId, orgId);
    setInsights(AdvisorWorkspaceViewModel.adaptInsights(rawInsights));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Compass className="animate-spin-slow text-primary mb-4" size={32} />
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Sincronizando Governance OS...</p>
      </div>
    );
  }

  const activeOrg = portfolio.find(o => o.id === activeOrgId);

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
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-amber-500/30 shadow-sm"
          >
            <span>Abrir War Room</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('MEMORY', '/memory')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-emerald-500/30 shadow-sm"
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
