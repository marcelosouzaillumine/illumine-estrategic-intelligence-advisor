import { TenantRole, TenantPermission } from './TenancyTypes';

const MATRIX: Record<TenantRole, TenantPermission> = {
  MASTER_ADMIN: { role: 'MASTER_ADMIN', canRunScenario: true, canViewReports: true, canEditData: true, canApproveExecution: true },
  ADVISOR: { role: 'ADVISOR', canRunScenario: true, canViewReports: true, canEditData: true, canApproveExecution: false },
  CLIENT_ADMIN: { role: 'CLIENT_ADMIN', canRunScenario: false, canViewReports: true, canEditData: true, canApproveExecution: true },
  BOARD_MEMBER: { role: 'BOARD_MEMBER', canRunScenario: false, canViewReports: true, canEditData: false, canApproveExecution: false },
  CONTROLLER: { role: 'CONTROLLER', canRunScenario: false, canViewReports: true, canEditData: true, canApproveExecution: false },
  AUDITOR: { role: 'AUDITOR', canRunScenario: false, canViewReports: true, canEditData: false, canApproveExecution: false },
  READ_ONLY: { role: 'READ_ONLY', canRunScenario: false, canViewReports: true, canEditData: false, canApproveExecution: false }
};

export class PermissionMatrixResolver {
  static resolvePermissions(role: TenantRole): TenantPermission {
    return MATRIX[role] || MATRIX.READ_ONLY;
  }
}
