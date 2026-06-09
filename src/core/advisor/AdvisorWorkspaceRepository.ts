import { AdvisorWorkspace } from '../../types/advisor/AdvisorWorkspace';
import { AdvisorClientContext } from '../../types/advisor/AdvisorClientContext';
import { AdvisorInsightReference } from '../../types/advisor/AdvisorInsightReference';

/**
 * Repositório Observacional do Advisor Workspace.
 * Apenas leitura e consolidação de referências.
 */
export interface AdvisorWorkspaceRepository {
  loadWorkspace(advisorId: string, tenantId: string): Promise<AdvisorWorkspace | null>;
  saveWorkspace(workspace: AdvisorWorkspace): Promise<void>;
  
  loadOrganizations(tenantId: string): Promise<AdvisorClientContext[]>;
  
  loadInsights(organizationId: string): Promise<AdvisorInsightReference[]>;
  
  // Stubs for reading from Board Investigation / Time Machine layers
  loadInvestigations(organizationId: string): Promise<string[]>;
  loadTimelines(organizationId: string): Promise<string[]>;
}

// Em uma implementação real, criariamos o FirestoreAdvisorWorkspaceRepository, mas para
// manter o foco na camada fiduciária do workspace, faremos um In-Memory Mock temporário.
export class MockAdvisorWorkspaceRepository implements AdvisorWorkspaceRepository {
  private workspace: AdvisorWorkspace | null = null;
  private orgs: AdvisorClientContext[] = [];

  async loadWorkspace(advisorId: string, tenantId: string): Promise<AdvisorWorkspace | null> {
    return this.workspace;
  }

  async saveWorkspace(workspace: AdvisorWorkspace): Promise<void> {
    this.workspace = workspace;
  }

  async loadOrganizations(tenantId: string): Promise<AdvisorClientContext[]> {
    return this.orgs;
  }

  async loadInsights(organizationId: string): Promise<AdvisorInsightReference[]> {
    return [];
  }

  async loadInvestigations(organizationId: string): Promise<string[]> {
    return [];
  }

  async loadTimelines(organizationId: string): Promise<string[]> {
    return [];
  }
}
