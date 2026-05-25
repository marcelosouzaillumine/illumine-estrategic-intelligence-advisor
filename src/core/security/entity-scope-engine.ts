import { EntityScopeDecision, EntityScopeEvaluationInput } from './types';

export class EntityScopeEngine {
  /**
   * Avalia o escopo de entidade baseado no princípio Institutional Isolation First
   */
  static evaluate(input: EntityScopeEvaluationInput): EntityScopeDecision {
    if (!input || !input.tenantId) {
      return {
        allowed: false,
        reason: 'Missing evaluation context',
        decisionCode: 'DENY_MISSING_CONTEXT',
      };
    }

    // 4. Ausência de entityScope deverá negar acesso.
    if (!input.requestedEntityScope) {
      return {
         allowed: false,
         reason: 'No entity scope requested',
         decisionCode: 'DENY_ENTITY_SCOPE'
      };
    }

    // 5. Nenhuma entidade poderá cruzar tenants. 
    // Esse teste é feito principalmente no PermissionEngine onde temos o tenant do user e do resource. 
    // Mas o EntityScope só garante as permissões locais de entidade.

    // 2. Consolidado só pode ser acessado por quem possuir consolidatedScope.
    if (input.requestedEntityScope === 'CONSOLIDATED' && !input.consolidatedScope) {
      return {
        allowed: false,
        reason: 'Missing consolidated scope permission',
        decisionCode: 'DENY_ENTITY_SCOPE',
      };
    }

    // 3. Holding/grupo só pode ser acessado por quem possuir allowedGroupIds.
    if (input.requestedEntityScope === 'GROUP' && input.groupId) {
      if (!input.allowedGroupIds || !input.allowedGroupIds.includes(input.groupId)) {
        return {
          allowed: false,
          reason: 'Group access not allowed',
          decisionCode: 'DENY_ENTITY_SCOPE',
        };
      }
    }

    // 1. Usuário só pode acessar entidades explicitamente permitidas.
    if (input.requestedEntityScope === 'ENTITY' && input.entityId) {
      if (!input.allowedEntityIds || !input.allowedEntityIds.includes(input.entityId)) {
        return {
          allowed: false,
          reason: 'Entity access not explicitly allowed',
          decisionCode: 'DENY_ENTITY_SCOPE',
        };
      }
    }

    // Se chegou até aqui com entity scope pedido
    if (input.requestedEntityScope === 'ENTITY' && !input.entityId) {
       return {
         allowed: false,
         reason: 'Entity ID missing for ENTITY scope',
         decisionCode: 'DENY_ENTITY_SCOPE'
       }
    }

    return {
      allowed: true,
      reason: 'Entity scope validated successfully',
      decisionCode: 'ALLOW',
    };
  }
}
