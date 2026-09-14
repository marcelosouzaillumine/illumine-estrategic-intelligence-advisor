import { IAuthorizationPersistence } from '../../../../contracts/persistence/IAuthorizationPersistence';
import { Role, Permission, Capability, Action } from '../../../../domain/authorization/RBAC';

export class AuthorizationRepository {
  constructor(private persistence: IAuthorizationPersistence) {}

  async getRoleByCode(roleCode: string): Promise<Role | null> {
    return this.persistence.getRoleByCode(roleCode);
  }

  async getAllRoles(): Promise<Role[]> {
    return this.persistence.getAllRoles();
  }

  async saveRole(role: Role): Promise<void> {
    return this.persistence.saveRole(role);
  }

  async getPermissionByCode(permissionCode: string): Promise<Permission | null> {
    return this.persistence.getPermissionByCode(permissionCode);
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.persistence.getAllPermissions();
  }

  async savePermission(permission: Permission): Promise<void> {
    return this.persistence.savePermission(permission);
  }

  async getCapabilityByCode(capabilityCode: string): Promise<Capability | null> {
    return this.persistence.getCapabilityByCode(capabilityCode);
  }

  async getAllCapabilities(): Promise<Capability[]> {
    return this.persistence.getAllCapabilities();
  }

  async saveCapability(capability: Capability): Promise<void> {
    return this.persistence.saveCapability(capability);
  }

  async getActionByCode(actionCode: string): Promise<Action | null> {
    return this.persistence.getActionByCode(actionCode);
  }

  async getAllActions(): Promise<Action[]> {
    return this.persistence.getAllActions();
  }

  async saveAction(action: Action): Promise<void> {
    return this.persistence.saveAction(action);
  }
}
