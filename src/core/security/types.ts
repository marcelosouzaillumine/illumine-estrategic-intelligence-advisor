export type OfficialRole =
  | 'SUPER_ADMIN'
  | 'TENANT_ADMIN'
  | 'BOARD_MEMBER'
  | 'CFO'
  | 'CONTROLLER'
  | 'AUDITOR'
  | 'ADVISOR'
  | 'OPERATIONAL_USER'
  | 'INVESTOR';

export type OfficialAction =
  | 'VIEW_DASHBOARD'
  | 'VIEW_FINANCIALS'
  | 'VIEW_EXECUTIVE_ADVISORY'
  | 'VIEW_CAUSALITY'
  | 'VIEW_OBSERVABILITY'
  | 'CREATE_SIMULATION'
  | 'SHARE_SIMULATION'
  | 'APPROVE_SIMULATION'
  | 'VIEW_SIMULATION'
  | 'EXPORT_SIMULATION'
  | 'CREATE_SNAPSHOT'
  | 'VIEW_SNAPSHOT'
  | 'EXPORT_SNAPSHOT'
  | 'CREATE_BOARD_PACK'
  | 'APPROVE_BOARD_PACK'
  | 'VIEW_BOARD_PACK'
  | 'EXPORT_BOARD_PACK'
  | 'MANAGE_USERS'
  | 'MANAGE_TENANT'
  | 'MANAGE_ENTITY'
  | 'VIEW_AUDIT_LOGS'
  | 'EXECUTE_REPLAY'
  | 'IMPORT_DATA'
  | 'APPROVE_DATA'
  | 'CONFIGURE_POLICIES'
  | 'CREATE_REPORT';

export type VisibilityPolicy =
  | 'PUBLIC_WITHIN_TENANT'
  | 'INTERNAL'
  | 'CFO_ONLY'
  | 'BOARD_ONLY'
  | 'AUDIT_LOCKED'
  | 'INVESTOR_APPROVED'
  | 'PRIVATE_TO_OWNER'
  | 'BOARD_APPROVED'
  | 'REGULATORY_EXPORT'
  | 'DRAFT';

export type DecisionCode =
  | 'ALLOW'
  | 'DENY_BY_DEFAULT'
  | 'DENY_MISSING_CONTEXT'
  | 'DENY_CROSS_TENANT'
  | 'DENY_ROLE_NOT_ALLOWED'
  | 'DENY_PERMISSION_NOT_GRANTED'
  | 'DENY_ENTITY_SCOPE'
  | 'DENY_VISIBILITY_POLICY'
  | 'DENY_APPROVAL_STATE'
  | 'DENY_OWNER_SCOPE'
  | 'DENY_AUDIT_REQUIRED'
  | 'DENY_SUPER_ADMIN_DATA_ACCESS';

export interface EntityScopeEvaluationInput {
  tenantId: string;
  entityId?: string;
  allowedEntityIds: string[];
  groupId?: string;
  allowedGroupIds: string[];
  consolidatedScope: boolean;
  ownershipScope?: string;
  requestedEntityScope?: string;
}

export interface EntityScopeDecision {
  allowed: boolean;
  reason: string;
  decisionCode: DecisionCode;
}

export interface PermissionEvaluationInput {
  tenantId: string;
  actorId: string;
  userRole: OfficialRole;
  permissions: OfficialAction[];
  requestedAction: OfficialAction;
  resourceType: string;
  resourceTenantId: string;
  entityScope: EntityScopeEvaluationInput;
  visibilityPolicy?: VisibilityPolicy;
  approvalState?: string;
  resourceOwnerId?: string;
  auditRequirement?: boolean;
  sessionId?: string;
}

export interface PermissionDecision {
  allowed: boolean;
  reason: string;
  decisionCode: DecisionCode;
  auditRequired: boolean;
  evaluatedAt: string;
}
