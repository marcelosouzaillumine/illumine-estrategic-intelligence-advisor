import { AdvisorWorkspace } from '../../types/advisor/AdvisorWorkspace';
import { AdvisorWorkspaceRepository } from './AdvisorWorkspaceRepository';

/**
 * Mantém o contexto operacional atual do Advisor.
 * Responsável por gerenciar o "state" da navegação institucional sem interferir nas engines base.
 */
export class AdvisorContextEngine {
  constructor(private readonly repository: AdvisorWorkspaceRepository) {}

  async switchOrganization(advisorId: string, tenantId: string, newOrganizationId: string): Promise<void> {
    const workspace = await this.repository.loadWorkspace(advisorId, tenantId);
    if (!workspace) return;

    // Zero cálculo. Apenas state mutation observacional
    workspace.activeOrganizationId = newOrganizationId;
    workspace.activeWorkspaceMode = 'OVERVIEW'; // Reseta a visão ao trocar de Org
    workspace.updatedAt = new Date().toISOString();

    await this.repository.saveWorkspace(workspace);
  }

  async setWorkspaceMode(advisorId: string, tenantId: string, mode: AdvisorWorkspace['activeWorkspaceMode']): Promise<void> {
    const workspace = await this.repository.loadWorkspace(advisorId, tenantId);
    if (!workspace) return;

    workspace.activeWorkspaceMode = mode;
    workspace.updatedAt = new Date().toISOString();

    await this.repository.saveWorkspace(workspace);
  }
}
