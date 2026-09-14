import { AdvisorWorkspaceContext } from './TenancyTypes';

export interface TenantLineageMetadata {
  tenantId: string;
  workspaceId: string;
  ownershipContext: string; // ex: 'ADVISORY_FIRM_EXECUTION'
}

export class TenantLineageBinder {
  /**
   * Anexa o carimbo de Tenant em qualquer payload (Reports, Snapshots, Traces).
   */
  static bind(context: AdvisorWorkspaceContext): TenantLineageMetadata {
    return {
      tenantId: context.activeTenantId,
      workspaceId: context.activeWorkspaceId,
      ownershipContext: `${context.role}_EXECUTION`
    };
  }
}
