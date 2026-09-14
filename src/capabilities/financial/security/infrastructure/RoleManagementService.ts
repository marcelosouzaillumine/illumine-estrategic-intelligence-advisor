import { logger } from "../../../../services/logging/InstitutionalLogger";
import { getFunctions, httpsCallable } from 'firebase/functions';
import { UserRole } from '../../../../services/security/AccessControlService';

export class RoleManagementService {
  /**
   * Assigns a role to a user via the manageRole Cloud Function.
   * Only SUPER_ADMIN users can perform this action successfully.
   */
  static async assignRole(targetUid: string, newRole: UserRole): Promise<void> {
    const functions = getFunctions();
    const manageRoleFn = httpsCallable(functions, 'manageRole');

    try {
      await manageRoleFn({ targetUid, newRole });
    } catch (error) {
      logger.error('Failed to assign role', error);
      throw error;
    }
  }

  /**
   * Revokes all RBAC roles from a user (sets role to 'NONE').
   */
  static async revokeRole(targetUid: string): Promise<void> {
    await this.assignRole(targetUid, 'NONE');
  }
}
