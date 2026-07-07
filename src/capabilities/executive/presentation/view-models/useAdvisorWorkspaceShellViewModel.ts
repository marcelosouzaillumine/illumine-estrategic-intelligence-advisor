import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdvisorWorkspaceRuntime } from '../../../../core/advisor/AdvisorWorkspaceRuntime';
import { AdvisorContextEngine } from '../../../../core/advisor/AdvisorContextEngine';
import { AdvisorWorkspaceViewModel, UIOrganizationPortfolioItem, UIAdvisorInsight } from '../../../../viewmodels/advisor/AdvisorWorkspaceViewModel';
import { AdvisorWorkspaceApplicationService } from '../../application/AdvisorWorkspaceApplicationService';

export interface UseAdvisorWorkspaceShellViewModelProps {
  runtime: AdvisorWorkspaceRuntime;
  contextEngine: AdvisorContextEngine;
  advisorId: string;
  tenantId: string;
}

export function useAdvisorWorkspaceShellViewModel({
  runtime,
  contextEngine,
  advisorId,
  tenantId
}: UseAdvisorWorkspaceShellViewModelProps) {
  const navigate = useNavigate();

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
        AdvisorWorkspaceApplicationService.recordPortfolioLoaded(tenantId, advisorId);

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
    
    AdvisorWorkspaceApplicationService.recordOrganizationSelected(tenantId, orgId, advisorId);
    
    // Recarregar insights
    const { insights: rawInsights } = await runtime.loadOrganizationContext(tenantId, orgId);
    setInsights(AdvisorWorkspaceViewModel.adaptInsights(rawInsights));
  };

  const handleCrossNavigation = (targetWorkspace: string, path: string) => {
    AdvisorWorkspaceApplicationService.performNavigation(targetWorkspace, path, navigate);
  };

  const activeOrg = portfolio.find(o => o.id === activeOrgId);

  return {
    state: {
      portfolio,
      activeOrgId,
      insights,
      loading,
      activeOrg
    },
    computed: {
      // reserved for future computed values
    },
    actions: {
      handleSelectOrganization,
      handleCrossNavigation
    }
  };
}
