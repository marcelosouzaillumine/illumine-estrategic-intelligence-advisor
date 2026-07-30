export interface SaaSAuditTrailContract {
  readonly auditLogId: string;
  readonly correlationId: string;
  readonly executionId: string;
  readonly timestamp: string;
  readonly actorUserId: string;
  readonly organizationId: string;
  readonly tenantId: string;
  readonly workspaceId?: string;
  readonly actionType: string; // ex: 'PROVISION_ORGANIZATION', 'UPDATE_QUOTA'
  readonly resultStatus: 'SUCCESS' | 'FAILED' | 'RETRYING';
  readonly metadataDetails?: string;
}
