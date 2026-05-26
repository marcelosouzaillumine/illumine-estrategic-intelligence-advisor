import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { TenantResolutionEngine } from '../src/core/security/auth/TenantResolutionEngine';
import { User } from 'firebase/auth';

describe('TenantResolutionEngine - Institutional Auth & Tenant Resolution', () => {
  let originalGetFirestoreDocs: any;

  beforeEach(() => {
    originalGetFirestoreDocs = TenantResolutionEngine.getFirestoreDocs;
  });

  afterEach(() => {
    TenantResolutionEngine.getFirestoreDocs = originalGetFirestoreDocs;
  });

  it('1. Super Admin (Master) recebe role SUPER_ADMIN e acesso global imediato', async () => {
    const mockUser = {
      uid: 'master-user-uid',
      email: 'marcelosouza.illumine@gmail.com'
    } as User;

    const session = await TenantResolutionEngine.resolve(mockUser);
    
    assert.strictEqual(session.actorId, 'master-user-uid');
    assert.strictEqual(session.tenantId, 'MASTER');
    assert.strictEqual(session.role, 'SUPER_ADMIN');
    assert.strictEqual(session.sessionState, 'READY');
    assert.ok(session.permissions.includes('VIEW_DASHBOARD'));
    assert.ok(session.permissions.includes('CONFIGURE_POLICIES'));
  });

  it('2. Usuário não cadastrado em nenhum tenant tem acesso DENIED', async () => {
    const mockUser = {
      uid: 'unregistered-user-uid',
      email: 'stranger@unknown.com'
    } as User;

    // Mock resolve to return no documents for clients, client_users, or partners
    TenantResolutionEngine.getFirestoreDocs = async () => {
      return { docs: [] };
    };

    const session = await TenantResolutionEngine.resolve(mockUser);
    
    assert.strictEqual(session.actorId, 'unregistered-user-uid');
    assert.strictEqual(session.tenantId, '');
    assert.strictEqual(session.sessionState, 'DENIED');
    assert.strictEqual(session.permissions.length, 0);
  });

  it('3. Usuário associado a apenas um tenant recebe acesso direto (READY)', async () => {
    const mockUser = {
      uid: 'one-tenant-user-uid',
      email: 'cfo@company.com'
    } as User;

    // Mock resolve queries
    TenantResolutionEngine.getFirestoreDocs = async (q: any) => {
      // String representation of query or query details to identify which collection is being fetched
      const queryStr = q?._query?.path?.segments?.join('/') || '';
      
      if (queryStr.includes('clients')) {
        return {
          docs: [{
            id: 'tenant-company-a',
            data: () => ({ fantasia: 'Company A', ownerId: 'one-tenant-user-uid' })
          }]
        };
      }
      return { docs: [] };
    };

    const session = await TenantResolutionEngine.resolve(mockUser);
    
    assert.strictEqual(session.actorId, 'one-tenant-user-uid');
    assert.strictEqual(session.tenantId, 'tenant-company-a');
    assert.strictEqual(session.role, 'CFO');
    assert.strictEqual(session.sessionState, 'READY');
    // CFO permissions
    assert.ok(session.permissions.includes('VIEW_FINANCIALS'));
    assert.ok(session.permissions.includes('CREATE_SIMULATION'));
    assert.ok(session.permissions.includes('EXPORT_BOARD_PACK'));
    assert.ok(!session.permissions.includes('CONFIGURE_POLICIES')); // CFO does not configure system-wide policies
  });

  it('4. Usuário associado a múltiplos tenants exige seleção explícita (TENANT_SELECTION_REQUIRED)', async () => {
    const mockUser = {
      uid: 'multi-tenant-user-uid',
      email: 'multi@company.com'
    } as User;

    // Mock query collection results
    TenantResolutionEngine.getFirestoreDocs = async (q: any) => {
      const queryStr = q?._query?.path?.segments?.join('/') || '';
      
      if (queryStr.includes('clients')) {
        // Owner of client-a
        return {
          docs: [{
            id: 'tenant-client-a',
            data: () => ({ fantasia: 'Client A', ownerId: 'multi-tenant-user-uid' })
          }]
        };
      }
      if (queryStr.includes('client_users')) {
        // Associated with client-b
        return {
          docs: [{
            id: 'assoc-1',
            data: () => ({ clientId: 'tenant-client-b', clientName: 'Client B', status: 'Ativo', role: 'CONTROLLER' })
          }]
        };
      }
      return { docs: [] };
    };

    const session = await TenantResolutionEngine.resolve(mockUser);
    
    assert.strictEqual(session.actorId, 'multi-tenant-user-uid');
    assert.strictEqual(session.tenantId, ''); // No active tenant chosen yet
    assert.strictEqual(session.sessionState, 'TENANT_SELECTION_REQUIRED');
    assert.strictEqual(session.availableTenants.length, 2);
    
    // Test activate tenant Client B
    const activeSession = TenantResolutionEngine.activateTenant(session, 'tenant-client-b');
    assert.strictEqual(activeSession.tenantId, 'tenant-client-b');
    assert.strictEqual(activeSession.role, 'CONTROLLER');
    assert.strictEqual(activeSession.sessionState, 'READY');
    // Controller permissions
    assert.ok(activeSession.permissions.includes('VIEW_FINANCIALS'));
    assert.ok(activeSession.permissions.includes('CREATE_SIMULATION'));
    assert.ok(!activeSession.permissions.includes('EXPORT_BOARD_PACK')); // Controller cannot export board pack
  });

  it('5. Engine rejeita ativação de tenant não pertencente aos availableTenants', async () => {
    const mockUser = {
      uid: 'user-uid',
      email: 'user@company.com'
    } as User;

    TenantResolutionEngine.getFirestoreDocs = async (q: any) => {
      const queryStr = q?._query?.path?.segments?.join('/') || '';
      if (queryStr.includes('clients')) {
        return {
          docs: [{
            id: 'tenant-allowed',
            data: () => ({ fantasia: 'Company Allowed', ownerId: 'user-uid' })
          }]
        };
      }
      return { docs: [] };
    };

    const session = await TenantResolutionEngine.resolve(mockUser);
    assert.strictEqual(session.sessionState, 'READY');
    assert.strictEqual(session.tenantId, 'tenant-allowed');

    // Attempting to activate an foreign tenant should deny access
    const compromisedSession = TenantResolutionEngine.activateTenant(session, 'tenant-compromised');
    assert.strictEqual(compromisedSession.sessionState, 'DENIED');
  });
});
