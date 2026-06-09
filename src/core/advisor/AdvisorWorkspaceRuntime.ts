import { AdvisorWorkspaceRepository } from './AdvisorWorkspaceRepository';
import { AdvisorWorkspace } from '../../types/advisor/AdvisorWorkspace';
import { AdvisorClientContext } from '../../types/advisor/AdvisorClientContext';
import { AdvisorInsightReference } from '../../types/advisor/AdvisorInsightReference';

/**
 * Runtime Observacional do Advisor Workspace.
 * ZERO execução de engines fiduciárias. ZERO inferência.
 * Atua apenas consolidando e entregando artefatos institucionais.
 */
export class AdvisorWorkspaceRuntime {
  constructor(private readonly repository: AdvisorWorkspaceRepository) {}

  async loadWorkspaceState(advisorId: string, tenantId: string): Promise<AdvisorWorkspace | null> {
    return this.repository.loadWorkspace(advisorId, tenantId);
  }

  async loadPortfolio(tenantId: string): Promise<AdvisorClientContext[]> {
    return this.repository.loadOrganizations(tenantId);
  }

  async loadOrganizationContext(tenantId: string, organizationId: string): Promise<{
    context: AdvisorClientContext | null;
    insights: AdvisorInsightReference[];
  }> {
    const orgs = await this.loadPortfolio(tenantId);
    const context = orgs.find(o => o.organizationId === organizationId) || null;
    
    if (!context) {
      return { context: null, insights: [] };
    }

    const insights = await this.repository.loadInsights(organizationId);

    return { context, insights };
  }
}
