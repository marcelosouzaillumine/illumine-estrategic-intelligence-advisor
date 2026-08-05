import { AIContext } from '@/core/intelligence/providers/AIContext';
import { TenantContext } from '@/core/tenant/TenantContext';
import { SecurityContext } from '@/core/security/SecurityContext';

export class AIContextBuilder {
  build(tenant: TenantContext, security: SecurityContext, activeWorkspaceId: string): AIContext {
    // Restricts the AI context strictly to what the user's security role permits
    return {
      tenantId: tenant.tenantId,
      workspaceId: activeWorkspaceId,
      userRole: security.roles[0] || 'operator',
      allowedKnowledge: security.permissions, // E.g., ['finance_read', 'hr_read']
      restrictions: [], // Dynamically mapped from blocked domains
      knowledgeScope: {
        entities: [],
        domains: []
      }
    };
  }
}
