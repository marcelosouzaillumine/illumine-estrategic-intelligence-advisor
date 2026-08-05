import { collection, doc, getDoc, getDocs, query, setDoc, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ITenantPersistence } from '../../contracts/persistence/ITenantPersistence';
import { Tenant, Membership } from '../../domain/tenant/Tenant';

export class FirestoreTenantAdapter implements ITenantPersistence {
  async getTenantById(tenantId: string): Promise<Tenant | null> {
    const d = await getDoc(doc(db, 'tenants', tenantId));
    return d.exists() ? { id: d.id, ...d.data() } as Tenant : null;
  }

  async getTenantsByOwnerId(ownerId: string): Promise<Tenant[]> {
    const q = query(collection(db, 'tenants'), where('ownerId', '==', ownerId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Tenant));
  }

  async createTenant(tenant: Tenant): Promise<string> {
    await setDoc(doc(db, 'tenants', tenant.id), tenant);
    return tenant.id;
  }

  async updateTenant(tenantId: string, payload: Partial<Tenant>): Promise<void> {
    await setDoc(doc(db, 'tenants', tenantId), payload, { merge: true });
  }

  async deleteTenant(tenantId: string): Promise<void> {
    await deleteDoc(doc(db, 'tenants', tenantId));
  }

  async getMembershipsByUserId(userId: string): Promise<Membership[]> {
    const q = query(collection(db, 'tenant_memberships'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Membership));
  }

  async getMembershipsByTenantId(tenantId: string): Promise<Membership[]> {
    const q = query(collection(db, 'tenant_memberships'), where('tenantId', '==', tenantId));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Membership));
  }

  async createMembership(membership: Membership): Promise<void> {
    await setDoc(doc(db, 'tenant_memberships', membership.id), membership);
  }

  async updateMembership(membershipId: string, payload: Partial<Membership>): Promise<void> {
    await setDoc(doc(db, 'tenant_memberships', membershipId), payload, { merge: true });
  }

  async removeMembership(membershipId: string): Promise<void> {
    await deleteDoc(doc(db, 'tenant_memberships', membershipId));
  }
}
