export interface SaaSWorkspaceContract {
  readonly workspaceId: string;
  readonly tenantId: string;
  readonly workspaceType: 'EXECUTIVE_DECISION' | 'PLATFORM_GOVERNANCE' | 'ADVISORY_PARTNER';
  readonly name: string;
  readonly activeTemplateId: string;
  readonly isDefault: boolean;
}
