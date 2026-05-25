import { describe, it } from 'node:test';
import assert from 'node:assert';
import { PermissionEngine } from '../src/core/security/permission-engine';
import { EntityScopeEngine } from '../src/core/security/entity-scope-engine';
import { PermissionEvaluationInput } from '../src/core/security/types';

describe('PermissionEngine & EntityScopeEngine - Institutional Isolation First', () => {

  const baseInput: PermissionEvaluationInput = {
    tenantId: 'tenant-123',
    actorId: 'user-001',
    userRole: 'OPERATIONAL_USER',
    permissions: ['VIEW_DASHBOARD'],
    requestedAction: 'VIEW_DASHBOARD',
    resourceType: 'Dashboard',
    resourceTenantId: 'tenant-123',
    visibilityPolicy: 'PUBLIC_WITHIN_TENANT',
    entityScope: {
      tenantId: 'tenant-123',
      requestedEntityScope: 'ENTITY',
      entityId: 'ent-1',
      allowedEntityIds: ['ent-1'],
      allowedGroupIds: [],
      consolidatedScope: false
    }
  };

  it('1. Deny by default sem contexto', () => {
    const input = { ...baseInput, tenantId: '' };
    const decision = PermissionEngine.evaluatePermission(input as any);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_MISSING_CONTEXT');
  });

  it('2. Deny cross-tenant', () => {
    const input = { ...baseInput, resourceTenantId: 'tenant-999' };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_CROSS_TENANT');
  });

  it('3. CFO acessa advisory completo no próprio tenant', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      actorId: 'user-cfo',
      userRole: 'CFO',
      permissions: ['VIEW_EXECUTIVE_ADVISORY'],
      requestedAction: 'VIEW_EXECUTIVE_ADVISORY',
      visibilityPolicy: 'INTERNAL'
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, true);
    assert.strictEqual(decision.decisionCode, 'ALLOW');
  });

  it('4. INVESTOR não acessa causalidade interna', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'INVESTOR',
      permissions: ['VIEW_CAUSALITY'], // Mesmo que ele tenha a action
      requestedAction: 'VIEW_CAUSALITY',
      visibilityPolicy: 'INTERNAL'
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_ROLE_NOT_ALLOWED');
  });

  it('5. BOARD_MEMBER acessa board pack aprovado', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'BOARD_MEMBER',
      permissions: ['VIEW_BOARD_PACK'],
      requestedAction: 'VIEW_BOARD_PACK',
      visibilityPolicy: 'BOARD_APPROVED',
      approvalState: 'BOARD_APPROVED'
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, true);
  });

  it('6. OPERATIONAL_USER não acessa snapshots fiduciários', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'OPERATIONAL_USER',
      permissions: ['VIEW_SNAPSHOT'],
      requestedAction: 'VIEW_SNAPSHOT',
      visibilityPolicy: 'INTERNAL'
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_ROLE_NOT_ALLOWED');
  });

  it('7. AUDITOR acessa lineage e logs em read-only', () => {
    // Tenta VIEW
    const inputView: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'AUDITOR',
      permissions: ['VIEW_AUDIT_LOGS'],
      requestedAction: 'VIEW_AUDIT_LOGS',
      visibilityPolicy: 'INTERNAL'
    };
    assert.strictEqual(PermissionEngine.evaluatePermission(inputView).allowed, true);

    // Tenta CREATE
    const inputCreate: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'AUDITOR',
      permissions: ['CREATE_SIMULATION'],
      requestedAction: 'CREATE_SIMULATION',
      visibilityPolicy: 'INTERNAL'
    };
    assert.strictEqual(PermissionEngine.evaluatePermission(inputCreate).allowed, false);
  });

  it('8. TENANT_ADMIN gerencia usuários somente do próprio tenant', () => {
    const inputAllowed: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'TENANT_ADMIN',
      permissions: ['MANAGE_USERS'],
      requestedAction: 'MANAGE_USERS',
      resourceTenantId: 'tenant-123'
    };
    assert.strictEqual(PermissionEngine.evaluatePermission(inputAllowed).allowed, true);

    const inputDenied: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'TENANT_ADMIN',
      permissions: ['MANAGE_USERS'],
      requestedAction: 'MANAGE_USERS',
      resourceTenantId: 'tenant-999'
    };
    assert.strictEqual(PermissionEngine.evaluatePermission(inputDenied).allowed, false);
    assert.strictEqual(PermissionEngine.evaluatePermission(inputDenied).decisionCode, 'DENY_CROSS_TENANT');
  });

  it('9. EntityScope nega entidade fora do escopo', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      entityScope: {
        tenantId: 'tenant-123',
        requestedEntityScope: 'ENTITY',
        entityId: 'ent-999', // Requested 999
        allowedEntityIds: ['ent-1'], // Only 1 allowed
        allowedGroupIds: [],
        consolidatedScope: false
      }
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_ENTITY_SCOPE');
  });

  it('10. ConsolidatedScope exige permissão explícita', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      entityScope: {
        tenantId: 'tenant-123',
        requestedEntityScope: 'CONSOLIDATED',
        allowedEntityIds: [],
        allowedGroupIds: [],
        consolidatedScope: false // User doesn't have it
      }
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_ENTITY_SCOPE');
  });

  it('11. PRIVATE_TO_OWNER exige ownerId compatível', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      visibilityPolicy: 'PRIVATE_TO_OWNER',
      resourceOwnerId: 'user-002' // Different owner
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_OWNER_SCOPE');
  });

  it('12. BOARD_ONLY exige role compatível e approvalState correto', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      visibilityPolicy: 'BOARD_ONLY',
      userRole: 'CFO' // Not a board member or super admin
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_VISIBILITY_POLICY');
  });

  it('13. Exportações sensíveis exigem auditRequired true', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      permissions: ['EXPORT_SNAPSHOT'],
      requestedAction: 'EXPORT_SNAPSHOT'
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.auditRequired, true);
  });

  it('14. Ausência de visibilityPolicy nega acesso', () => {
    const input = { ...baseInput };
    delete input.visibilityPolicy;
    const decision = PermissionEngine.evaluatePermission(input as any);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_VISIBILITY_POLICY');
  });

  it('15. SUPER_ADMIN não deve ter permissão automática para acessar dados sensíveis de tenant sem autorização explícita', () => {
    const input: PermissionEvaluationInput = {
      ...baseInput,
      userRole: 'SUPER_ADMIN',
      resourceTenantId: 'tenant-other'
    };
    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_SUPER_ADMIN_DATA_ACCESS');
  });

});
