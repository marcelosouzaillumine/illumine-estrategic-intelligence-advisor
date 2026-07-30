export class SaaSRBACEngine {
  public static checkPermission(userRole: string, permissionName: string): boolean {
    if (userRole === 'ORG_ADMIN' || userRole === 'PARTNER_OWNER') return true;
    if (userRole === 'ADVISOR' && permissionName.startsWith('advisory.')) return true;
    if (userRole === 'EXECUTIVE_VIEWER' && permissionName.startsWith('read.')) return true;
    return false;
  }
}
