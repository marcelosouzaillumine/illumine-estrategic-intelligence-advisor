import { Role, Permission, Capability, Action } from '../../domain/authorization/RBAC';

export interface IAuthorizationPersistence {
  getRoleByCode(roleCode: string): Promise<Role | null>;
  getAllRoles(): Promise<Role[]>;
  saveRole(role: Role): Promise<void>;

  getPermissionByCode(permissionCode: string): Promise<Permission | null>;
  getAllPermissions(): Promise<Permission[]>;
  savePermission(permission: Permission): Promise<void>;

  getCapabilityByCode(capabilityCode: string): Promise<Capability | null>;
  getAllCapabilities(): Promise<Capability[]>;
  saveCapability(capability: Capability): Promise<void>;

  getActionByCode(actionCode: string): Promise<Action | null>;
  getAllActions(): Promise<Action[]>;
  saveAction(action: Action): Promise<void>;
}
