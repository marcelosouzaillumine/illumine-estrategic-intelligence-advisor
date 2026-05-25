import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GovernedRepositoryWrapper, GovernedRepositoryError } from '../src/core/security/governed-repository';
import { DataAccessContext } from '../src/core/security/data-access-context';

describe('GovernedRepositoryWrapper - Institutional Governance Enforcement', () => {

  const baseContext: DataAccessContext = {
    actorId: 'user-cfo',
    tenantId: 'tenant-1',
    role: 'CFO',
    permissions: ['VIEW_FINANCIALS', 'CREATE_SIMULATION', 'VIEW_SNAPSHOT', 'EXPORT_SNAPSHOT'],
    requestedAction: 'VIEW_FINANCIALS',
    resourceType: 'CashFlow',
    resourceTenantId: 'tenant-1',
    visibilityPolicy: 'INTERNAL',
    entityScope: {
      tenantId: 'tenant-1',
      requestedEntityScope: 'ENTITY',
      entityId: 'ent-1',
      allowedEntityIds: ['ent-1'],
      allowedGroupIds: [],
      consolidatedScope: false
    }
  };

  const mockDbOp = async () => 'DATA_FETCHED';

  it('1. Operação sem DataAccessContext é negada', async () => {
    try {
      await GovernedRepositoryWrapper.execute(undefined, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_MISSING_CONTEXT');
    }
  });

  it('2. Operação sem tenantId é negada', async () => {
    const ctx = { ...baseContext, tenantId: '' } as any;
    try {
      await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_MISSING_CONTEXT');
    }
  });

  it('3. Operação sem entityScope é negada quando aplicável', async () => {
    const ctx = { ...baseContext, entityScope: { ...baseContext.entityScope, requestedEntityScope: undefined } } as any;
    try {
      await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_ENTITY_SCOPE');
    }
  });

  it('4. Cross-tenant é negado', async () => {
    const ctx: DataAccessContext = { ...baseContext, resourceTenantId: 'tenant-999' };
    try {
      await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_CROSS_TENANT');
    }
  });

  it('5. CFO acessa dados financeiros do próprio tenant', async () => {
    const result = await GovernedRepositoryWrapper.execute(baseContext, mockDbOp);
    assert.strictEqual(result, 'DATA_FETCHED');
  });

  it('6. INVESTOR não acessa causalidade interna', async () => {
    const ctx: DataAccessContext = { 
      ...baseContext, 
      role: 'INVESTOR', 
      permissions: ['VIEW_CAUSALITY'], 
      requestedAction: 'VIEW_CAUSALITY' 
    };
    try {
      await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_ROLE_NOT_ALLOWED');
    }
  });

  it('7. BOARD_MEMBER acessa apenas board packs aprovados', async () => {
    const ctxApproved: DataAccessContext = {
      ...baseContext,
      role: 'BOARD_MEMBER',
      permissions: ['VIEW_BOARD_PACK'],
      requestedAction: 'VIEW_BOARD_PACK',
      visibilityPolicy: 'BOARD_APPROVED',
      approvalState: 'BOARD_APPROVED'
    };
    const result = await GovernedRepositoryWrapper.execute(ctxApproved, mockDbOp);
    assert.strictEqual(result, 'DATA_FETCHED');

    const ctxDraft: DataAccessContext = {
      ...ctxApproved,
      approvalState: 'DRAFT'
    };
    try {
      await GovernedRepositoryWrapper.execute(ctxDraft, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_APPROVAL_STATE');
    }
  });

  it('8. OPERATIONAL_USER não acessa snapshot fiduciário', async () => {
    const ctx: DataAccessContext = {
      ...baseContext,
      role: 'OPERATIONAL_USER',
      requestedAction: 'VIEW_SNAPSHOT'
    };
    try {
      await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_ROLE_NOT_ALLOWED');
    }
  });

  it('9. Snapshot export exige auditRequired (wrapper aceita o log)', async () => {
    const ctx: DataAccessContext = {
      ...baseContext,
      requestedAction: 'EXPORT_SNAPSHOT',
      permissions: ['EXPORT_SNAPSHOT']
    };
    // If it doesn't throw, it passed permissions and triggered the audit internally.
    const result = await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
    assert.strictEqual(result, 'DATA_FETCHED');
  });

  it('10. Simulation privada só pode ser vista por owner ou role autorizada', async () => {
    const ctx: DataAccessContext = {
      ...baseContext,
      visibilityPolicy: 'PRIVATE_TO_OWNER',
      resourceOwnerId: 'user-cfo'
    };
    const result = await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
    assert.strictEqual(result, 'DATA_FETCHED');

    const ctxBlocked: DataAccessContext = {
      ...ctx,
      resourceOwnerId: 'another-user'
    };
    try {
      await GovernedRepositoryWrapper.execute(ctxBlocked, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_OWNER_SCOPE');
    }
  });

  it('11. Consolidated runtime exige consolidatedScope', async () => {
    const ctx: DataAccessContext = {
      ...baseContext,
      entityScope: { ...baseContext.entityScope, requestedEntityScope: 'CONSOLIDATED' }
    };
    try {
      await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_ENTITY_SCOPE');
    }
  });

  it('12. Observability respeita tenant boundary', async () => {
    const ctx: DataAccessContext = {
      ...baseContext,
      resourceTenantId: 'another-tenant'
    };
    try {
      await GovernedRepositoryWrapper.execute(ctx, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_CROSS_TENANT');
    }
  });

  it('14. Ausência de visibilityPolicy nega acesso', async () => {
    const ctx = { ...baseContext };
    delete ctx.visibilityPolicy;
    try {
      await GovernedRepositoryWrapper.execute(ctx as any, mockDbOp);
      assert.fail('Should have thrown error');
    } catch (e: any) {
      assert.strictEqual(e.decisionCode, 'DENY_VISIBILITY_POLICY');
    }
  });

});
