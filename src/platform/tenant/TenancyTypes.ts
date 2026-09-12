export type TenantType = 'ADVISORY_FIRM' | 'FAMILY_OFFICE' | 'HOLDING' | 'ENTERPRISE_GROUP' | 'PRIVATE_EQUITY' | 'INDEPENDENT_CFO';
export type TenantRole = 'MASTER_ADMIN' | 'ADVISOR' | 'CLIENT_ADMIN' | 'BOARD_MEMBER' | 'CONTROLLER' | 'AUDITOR' | 'READ_ONLY';

export interface Tenant {
  tenantId: string;
  tenantName: string;
  tenantType: TenantType;
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  advisorIds: string[]; // IDs de auth dos advisors ligados a este Tenant
  workspaceIds: string[];
}

export interface Workspace {
  workspaceId: string;
  tenantId: string;
  workspaceName: string;
  groupId: string; // Grupo econômico associado a este workspace
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
}

export interface TenantPermission {
  role: TenantRole;
  canRunScenario: boolean;
  canViewReports: boolean;
  canEditData: boolean;
  canApproveExecution: boolean;
}

export interface TenantExecutionScope {
  tenantId: string;
  workspaceId: string;
  userId: string;
  role: TenantRole;
}

export interface TenantAuditRecord {
  auditId: string;
  tenantId: string;
  workspaceId: string | null;
  userId: string;
  action: 'LOGIN' | 'SWITCH_WORKSPACE' | 'EXECUTE_RUNTIME' | 'VIEW_REPORT' | 'EXPORT_JSON' | 'UNAUTHORIZED_ACCESS_ATTEMPT';
  timestamp: string;
  metadata?: any;
}

export interface AdvisorWorkspaceContext {
  activeTenantId: string;
  activeWorkspaceId: string;
  activeGroupId: string; // Para alimentar o Master Engine
  role: TenantRole;
}
