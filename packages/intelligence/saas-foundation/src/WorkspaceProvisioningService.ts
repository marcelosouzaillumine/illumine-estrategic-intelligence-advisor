import { SaaSWorkspaceContract } from '@illumine/executive-contracts';

export class WorkspaceProvisioningService {
  public static provisionDefaultWorkspaces(tenantId: string): readonly SaaSWorkspaceContract[] {
    return [
      {
        workspaceId: `ws-exec-${tenantId}`,
        tenantId,
        workspaceType: 'EXECUTIVE_DECISION',
        name: 'Executive Decision Workspace',
        activeTemplateId: 'tmpl-csuite-v1',
        isDefault: true
      },
      {
        workspaceId: `ws-adv-${tenantId}`,
        tenantId,
        workspaceType: 'ADVISORY_PARTNER',
        name: 'Partner Advisory Workspace',
        activeTemplateId: 'tmpl-partner-v1',
        isDefault: false
      }
    ];
  }
}
