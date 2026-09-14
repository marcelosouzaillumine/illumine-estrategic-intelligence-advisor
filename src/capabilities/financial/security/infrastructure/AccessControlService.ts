import { getAuth } from 'firebase/auth';

export type UserRole = 'SUPER_ADMIN' | 'GOVERNANCE_ADMIN' | 'ADVISOR' | 'CLIENT_ADMIN' | 'CLIENT_USER' | 'AUDITOR' | 'NONE';

export interface UserAccessContext {
  uid: string;
  email: string | null;
  role: UserRole;
  claims: Record<string, unknown>;
}

export class AccessControlService {
  /**
   * Retrieves the current user's access context including their role from Custom Claims.
   * If forceRefresh is true, it forces a token refresh to get the latest claims.
   */
  static async getUserAccessContext(forceRefresh: boolean = false): Promise<UserAccessContext | null> {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return null;
    }

    try {
      const idTokenResult = await currentUser.getIdTokenResult(forceRefresh);
      const claims = idTokenResult.claims;
      const role = (claims.role as UserRole) || 'NONE';

      return {
        uid: currentUser.uid,
        email: currentUser.email,
        role,
        claims
      };
    } catch (error) {
      console.error('Failed to get user access context:', error);
      return null;
    }
  }

  /**
   * Helper to synchronously check role if context was already loaded
   */
  static hasRole(context: UserAccessContext | null, requiredRole: UserRole): boolean {
    if (!context) return false;
    return context.role === requiredRole;
  }
}
