import { identityContainer } from '../../../infrastructure/container/identityContainer';
import { ExecutiveContext } from './ExecutiveContext';
import { SystemCapability } from '../../../domain/authorization/Capabilities';

export interface AuthorizationRequest {
  context: ExecutiveContext;
  capability: SystemCapability;
  resourceId?: string;
}

export interface AuthorizationResult {
  allowed: boolean;
  reason: string;
}

export class AuthorizationDecisionEngine {
  static async authorize(request: AuthorizationRequest): Promise<AuthorizationResult> {
    const { context, capability } = request;
    const { user, tenant, membership, capabilities } = context;

    if (!user || user.status !== 'ACTIVE') {
      return { allowed: false, reason: 'USER_INACTIVE_OR_NOT_FOUND' };
    }

    if (!tenant || tenant.status !== 'ACTIVE') {
      return { allowed: false, reason: 'TENANT_INACTIVE_OR_NOT_FOUND' };
    }

    if (!membership || membership.status !== 'ACTIVE') {
      return { allowed: false, reason: 'MEMBERSHIP_INACTIVE_OR_NOT_FOUND' };
    }

    const hasCapability = capabilities.includes(capability);

    if (hasCapability) {
      return { allowed: true, reason: 'ROLE_PERMISSION_MATCH' };
    }

    return { allowed: false, reason: 'CAPABILITY_NOT_GRANTED' };
  }
}
