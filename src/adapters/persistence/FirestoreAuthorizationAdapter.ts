import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { IAuthorizationPersistence } from '../../contracts/persistence/IAuthorizationPersistence';
import { Role, Permission, Capability, Action } from '../../domain/authorization/RBAC';

export class FirestoreAuthorizationAdapter implements IAuthorizationPersistence {
  async getRoleByCode(roleCode: string): Promise<Role | null> {
    const d = await getDoc(doc(db, 'auth_roles', roleCode));
    return d.exists() ? (d.data() as Role) : null;
  }

  async getAllRoles(): Promise<Role[]> {
    const snap = await getDocs(collection(db, 'auth_roles'));
    return snap.docs.map(d => d.data() as Role);
  }

  async saveRole(role: Role): Promise<void> {
    await setDoc(doc(db, 'auth_roles', role.code), role, { merge: true });
  }

  async getPermissionByCode(permissionCode: string): Promise<Permission | null> {
    const d = await getDoc(doc(db, 'auth_permissions', permissionCode));
    return d.exists() ? (d.data() as Permission) : null;
  }

  async getAllPermissions(): Promise<Permission[]> {
    const snap = await getDocs(collection(db, 'auth_permissions'));
    return snap.docs.map(d => d.data() as Permission);
  }

  async savePermission(permission: Permission): Promise<void> {
    await setDoc(doc(db, 'auth_permissions', permission.code), permission, { merge: true });
  }

  async getCapabilityByCode(capabilityCode: string): Promise<Capability | null> {
    const d = await getDoc(doc(db, 'auth_capabilities', capabilityCode));
    return d.exists() ? (d.data() as Capability) : null;
  }

  async getAllCapabilities(): Promise<Capability[]> {
    const snap = await getDocs(collection(db, 'auth_capabilities'));
    return snap.docs.map(d => d.data() as Capability);
  }

  async saveCapability(capability: Capability): Promise<void> {
    await setDoc(doc(db, 'auth_capabilities', capability.code), capability, { merge: true });
  }

  async getActionByCode(actionCode: string): Promise<Action | null> {
    const d = await getDoc(doc(db, 'auth_actions', actionCode));
    return d.exists() ? (d.data() as Action) : null;
  }

  async getAllActions(): Promise<Action[]> {
    const snap = await getDocs(collection(db, 'auth_actions'));
    return snap.docs.map(d => d.data() as Action);
  }

  async saveAction(action: Action): Promise<void> {
    await setDoc(doc(db, 'auth_actions', action.code), action, { merge: true });
  }
}
