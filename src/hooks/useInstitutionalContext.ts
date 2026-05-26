import { useInstitutionalAuth } from '../core/security/auth/InstitutionalAuthProvider';
import { OfficialRole, OfficialAction, EntityScopeEvaluationInput } from '../core/security/types';

export interface InstitutionalContextData {
  actorId: string;
  tenantId: string;
  role: OfficialRole;
  permissions: OfficialAction[];
  entityScope: EntityScopeEvaluationInput;
  legacyTenantId?: string;
  isLegacyContext: boolean;
  isContextReady: boolean;
  contextSource: string;
}

export function useInstitutionalContext(): InstitutionalContextData {
  const { session, loading } = useInstitutionalAuth();

  if (loading || !session || session.sessionState !== 'READY') {
    return {
      actorId: '',
      tenantId: '',
      role: 'OPERATIONAL_USER',
      permissions: [],
      entityScope: {
        tenantId: '',
        requestedEntityScope: 'ENTITY',
        entityId: '',
        allowedEntityIds: [],
        allowedGroupIds: [],
        consolidatedScope: false
      },
      isLegacyContext: false,
      isContextReady: false,
      contextSource: 'UNAUTHENTICATED'
    };
  }

  return {
    actorId: session.actorId,
    tenantId: session.tenantId,
    role: session.role,
    permissions: session.permissions,
    entityScope: {
      tenantId: session.tenantId,
      requestedEntityScope: 'ENTITY',
      allowedEntityIds: session.entityScope,
      allowedGroupIds: session.groupScope || [],
      consolidatedScope: session.consolidatedScope || false
    },
    legacyTenantId: session.tenantId, // Deprecated, mapped to tenantId
    isLegacyContext: false,
    isContextReady: true,
    contextSource: 'INSTITUTIONAL_AUTH_PROVIDER'
  };
}
