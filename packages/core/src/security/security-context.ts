export interface SecurityUser {
  id: string;
  tenantId: string;
  roles: string[];
  permissions: string[];
}

export class SecurityContext {
  private currentUser: SecurityUser | null = null;

  public setCurrentUser(user: SecurityUser): void {
    this.currentUser = user;
  }

  public getCurrentUser(): SecurityUser | null {
    return this.currentUser;
  }

  public hasRole(role: string): boolean {
    return this.currentUser?.roles.includes(role) || false;
  }

  public hasPermission(permission: string): boolean {
    return this.currentUser?.permissions.includes(permission) || false;
  }
}

export const securityContext = new SecurityContext();
