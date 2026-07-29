import { tenantService, TenantContext } from '../../../packages/tenant/src/index';

export function testTenantIsolation(): boolean {
  const tenantA = tenantService.createTenant('Holding Alpha');
  const orgA = tenantService.createOrganization(tenantA.id, 'Alpha Org');
  const wsA = tenantService.createWorkspace(orgA, 'Alpha Workspace');

  const tenantB = tenantService.createTenant('Holding Beta');
  const orgB = tenantService.createOrganization(tenantB.id, 'Beta Org');

  const context = new TenantContext();
  context.setContext(tenantA, orgA, wsA);

  if (context.getTenantId() !== tenantA.id) {
    throw new Error('Falha no isolamento do Tenant A');
  }

  // Tentar associar Org de Tenant B dentro de Tenant A deve disparar violação de isolamento
  let isolationViolationCaught = false;
  try {
    context.setContext(tenantA, orgB, wsA);
  } catch (err: any) {
    isolationViolationCaught = true;
  }

  if (!isolationViolationCaught) {
    throw new Error('Falha no bloqueio de violação de isolamento de Tenant');
  }

  return true;
}
