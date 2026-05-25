import { PermissionDecision, PermissionEvaluationInput } from './types';
import { EntityScopeEngine } from './entity-scope-engine';

export class PermissionEngine {
  /**
   * Avalia a permissão baseada nos princípios:
   * LEAST PRIVILEGE BY DEFAULT
   * DENY BY DEFAULT
   * Institutional Isolation First
   * No Cross-Tenant Access
   * Immutable Auditability
   */
  static evaluatePermission(input: PermissionEvaluationInput): PermissionDecision {
    const deny = (code: string, reason: string): PermissionDecision => ({
      allowed: false,
      reason,
      decisionCode: code as any,
      auditRequired: true, // Failures in sensitive operations often require audit
      evaluatedAt: new Date().toISOString()
    });

    // 1. Validar Contexto Obrigatório
    if (!input || !input.tenantId || !input.actorId || !input.userRole || !input.requestedAction || !input.resourceType || !input.resourceTenantId || !input.entityScope) {
      return deny('DENY_MISSING_CONTEXT', 'Faltam dados obrigatórios para avaliação de permissão');
    }

    const isSensitiveAction = [
      'EXPORT_SIMULATION', 'CREATE_SNAPSHOT', 'EXPORT_SNAPSHOT', 'CREATE_BOARD_PACK',
      'APPROVE_BOARD_PACK', 'EXPORT_BOARD_PACK', 'EXECUTE_REPLAY', 'SHARE_SIMULATION',
      'CONFIGURE_POLICIES', 'MANAGE_USERS'
    ].includes(input.requestedAction);

    // 2. Institutional Isolation First (Cross-Tenant)
    if (input.tenantId !== input.resourceTenantId) {
       // Only SUPER_ADMIN might have cross-tenant access, but requires explicit authorization.
       // Prompt: "SUPER_ADMIN não deve ter permissão automática para acessar dados sensíveis de tenant sem autorização explícita."
       if (input.userRole === 'SUPER_ADMIN') {
           // For this initial implementation, unless there is an explicit mechanism, we deny cross tenant.
           return deny('DENY_SUPER_ADMIN_DATA_ACCESS', 'SUPER_ADMIN cross-tenant access requires explicit institutional authorization');
       }
       return deny('DENY_CROSS_TENANT', 'Cross-tenant access is strictly prohibited');
    }

    // 3. Entity Scope Validation
    const scopeDecision = EntityScopeEngine.evaluate(input.entityScope);
    if (!scopeDecision.allowed) {
      return deny(scopeDecision.decisionCode, scopeDecision.reason);
    }

    // 4. Role Action Validation
    if (!input.permissions || !input.permissions.includes(input.requestedAction)) {
      return deny('DENY_PERMISSION_NOT_GRANTED', `Permission ${input.requestedAction} not explicitly granted to user`);
    }

    // 5. Hard Restrictions by Role
    if (input.userRole === 'OPERATIONAL_USER' && (input.requestedAction === 'VIEW_SNAPSHOT' || input.requestedAction === 'CREATE_SIMULATION' || input.requestedAction === 'VIEW_EXECUTIVE_ADVISORY')) {
      return deny('DENY_ROLE_NOT_ALLOWED', 'Operational users cannot access fiduciary or critical simulation data');
    }
    
    if (input.userRole === 'INVESTOR') {
      if (input.requestedAction === 'VIEW_CAUSALITY' || input.requestedAction === 'VIEW_AUDIT_LOGS') {
        return deny('DENY_ROLE_NOT_ALLOWED', 'Investors cannot view internal causality or logs');
      }
      if (input.visibilityPolicy !== 'INVESTOR_APPROVED' && input.visibilityPolicy !== 'PUBLIC_WITHIN_TENANT') {
        return deny('DENY_VISIBILITY_POLICY', 'Investors can only view investor-approved or public resources');
      }
    }

    if (input.userRole === 'BOARD_MEMBER') {
      if (input.visibilityPolicy !== 'BOARD_APPROVED' && input.visibilityPolicy !== 'BOARD_ONLY' && input.visibilityPolicy !== 'PUBLIC_WITHIN_TENANT') {
        return deny('DENY_VISIBILITY_POLICY', 'Board members can only view board-approved, board-only or public resources');
      }
    }

    if (input.userRole === 'AUDITOR' && (input.requestedAction === 'CREATE_SIMULATION' || input.requestedAction === 'APPROVE_BOARD_PACK')) {
      return deny('DENY_ROLE_NOT_ALLOWED', 'Auditors are read-only');
    }

    if (input.userRole === 'TENANT_ADMIN' && input.requestedAction === 'MANAGE_USERS' && input.resourceTenantId !== input.tenantId) {
      return deny('DENY_CROSS_TENANT', 'Tenant Admin cannot manage users of another tenant');
    }

    // 6. Visibility Policy Validation
    if (!input.visibilityPolicy) {
      return deny('DENY_VISIBILITY_POLICY', 'Visibility policy missing on resource');
    }

    if (input.visibilityPolicy === 'PRIVATE_TO_OWNER') {
      if (input.actorId !== input.resourceOwnerId) {
        return deny('DENY_OWNER_SCOPE', 'Resource is private to owner');
      }
    }

    if (input.visibilityPolicy === 'BOARD_ONLY' && input.userRole !== 'BOARD_MEMBER' && input.userRole !== 'SUPER_ADMIN') {
       return deny('DENY_VISIBILITY_POLICY', 'Resource is for Board Members only');
    }

    if (input.visibilityPolicy === 'CFO_ONLY' && input.userRole !== 'CFO' && input.userRole !== 'SUPER_ADMIN') {
       return deny('DENY_VISIBILITY_POLICY', 'Resource is for CFO only');
    }

    // 7. Approval State Validation
    if (input.visibilityPolicy === 'BOARD_APPROVED' && input.approvalState !== 'BOARD_APPROVED') {
       return deny('DENY_APPROVAL_STATE', 'Resource is not yet board approved');
    }
    
    if (input.visibilityPolicy === 'INVESTOR_APPROVED' && input.approvalState !== 'INVESTOR_APPROVED') {
       return deny('DENY_APPROVAL_STATE', 'Resource is not yet investor approved');
    }

    // Se chegou até aqui, passamos pelos "DENY" default gates.
    // 8. Output Final
    return {
      allowed: true,
      reason: 'Access granted by explicit policy',
      decisionCode: 'ALLOW',
      auditRequired: isSensitiveAction || !!input.auditRequirement,
      evaluatedAt: new Date().toISOString()
    };
  }
}
