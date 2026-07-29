import { tenantService } from '../../packages/tenant/src/index';
import { WorkspaceManager } from '../../packages/workspace/src/index';

export function testTenantOnboarding(): boolean {
  const tenant = tenantService.createTenant('Corporação Globex');
  const org = tenantService.createOrganization(tenant.id, 'Globex Brasil');

  const wsManager = new WorkspaceManager();
  const ws = wsManager.createWorkspace(tenant.id, org.id, 'Workspace Executivo CEO');

  if (ws.tenantId !== tenant.id || ws.organizationId !== org.id) {
    throw new Error('Falha no onboarding do Tenant e associação de Workspace');
  }

  return true;
}
