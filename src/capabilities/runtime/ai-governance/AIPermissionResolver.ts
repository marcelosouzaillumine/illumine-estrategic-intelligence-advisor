import { TenantRole } from '../../../core/runtime/tenancy/TenancyTypes';

export class AIPermissionResolver {
  static canAccessContext(role: TenantRole, contextType: string): boolean {
    const permissions: Record<TenantRole, string[]> = {
      MASTER_ADMIN: ['REPORT', 'SNAPSHOT', 'TRACE', 'VIOLATION', 'SCENARIO'],
      CLIENT_ADMIN: ['REPORT', 'SNAPSHOT', 'VIOLATION', 'SCENARIO'],
      ADVISOR: ['REPORT', 'SNAPSHOT', 'TRACE', 'VIOLATION', 'SCENARIO'],
      BOARD_MEMBER: ['REPORT', 'SNAPSHOT'],
      CONTROLLER: ['REPORT', 'SNAPSHOT', 'VIOLATION'],
      AUDITOR: ['REPORT', 'SNAPSHOT', 'TRACE', 'VIOLATION'],
      READ_ONLY: ['REPORT']
    };

    const allowed = permissions[role] || [];
    return allowed.includes(contextType);
  }
}
