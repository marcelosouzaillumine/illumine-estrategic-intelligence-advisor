import { UserAccessContext, UserRole } from '../../../../services/security/AccessControlService';

export class PermissionResolver {
  private context: UserAccessContext | null;

  constructor(context: UserAccessContext | null) {
    this.context = context;
  }

  /**
   * Check if the user has a specific role
   */
  hasRole(role: UserRole): boolean {
    if (!this.context) return false;
    return this.context.role === role;
  }

  /**
   * Check if the user is a SUPER_ADMIN
   */
  isSuperAdmin(): boolean {
    return this.hasRole('SUPER_ADMIN');
  }

  /**
   * Check if the user is a GOVERNANCE_ADMIN
   */
  isGovernanceAdmin(): boolean {
    return this.hasRole('GOVERNANCE_ADMIN');
  }

  /**
   * Check if the user has a role that implicitly gives them broad view access
   */
  hasGlobalReadAccess(): boolean {
    if (!this.context) return false;
    return ['SUPER_ADMIN', 'GOVERNANCE_ADMIN', 'AUDITOR'].includes(this.context.role);
  }

  /**
   * Checks if user has permission to manage platform settings
   */
  canManagePlatform(): boolean {
    return this.isSuperAdmin() || this.isGovernanceAdmin();
  }
}
