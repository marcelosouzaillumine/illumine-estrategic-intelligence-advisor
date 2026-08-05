import { createSecondaryUser } from '../../lib/firebase';
import { IdentityService } from '../../services/IdentityService';
import { TenantService } from '../../services/TenantService';
import { Membership } from '../../domain/tenant/Tenant';

/**
 * @deprecated This adapter is being migrated to use IdentityService and TenantService.
 * Direct Firestore calls have been removed.
 */
export function useClientUserAdapter(tenantId: string) {
  const fetchUsers = async () => {
    if (!tenantId) return [];
    try {
      const memberships = await TenantService.getMembershipsByTenant(tenantId);
      // To maintain UI compatibility, we map Membership back to the shape the UI expects
      return memberships.map(m => ({
        id: m.id,
        clientId: m.tenantId,
        email: m.userId, // Legacy UI used email as ID sometimes or stored it. We'll map userId to email if needed, but Membership has userId.
        userType: m.roleCode, // Legacy UI expects userType
        status: m.status,
      }));
    } catch (e: any) {
      console.error(e);
      return [];
    }
  };

  const saveUser = async (formData: any, editingId: string | null) => {
    const emailLower = formData.email.toLowerCase().trim();
    let generatedPass = null;

    let user = await IdentityService.getUserByEmail(emailLower);

    if (!editingId && !user) {
      generatedPass = Math.random().toString(36).substring(2, 8).toUpperCase() + '@123';
      try {
        await createSecondaryUser(emailLower, generatedPass);
        // Create user in Identity
        await IdentityService.createUser({
          id: emailLower, // using email as ID for legacy compatibility
          authUid: '', // We would need the UID from createSecondaryUser, but Firebase Auth admin is needed.
          email: emailLower,
          status: 'ACTIVE',
          createdAt: new Date(),
        });
      } catch (e: any) {
        if (e.code === 'auth/email-already-in-use') {
          throw e;
        } else {
          throw e;
        }
      }
    }

    const membership: Membership = {
      id: `${emailLower}_${tenantId}`,
      userId: emailLower,
      tenantId: tenantId,
      roleCode: formData.userType || 'Usuário de Cliente',
      status: 'ACTIVE',
      joinedAt: new Date(),
    };

    await TenantService.createMembership(membership);

    return { generatedPass, emailLower };
  };

  const linkExistingUser = async (formData: any) => {
    const emailLower = formData.email.toLowerCase().trim();
    
    const membership: Membership = {
      id: `${emailLower}_${tenantId}`,
      userId: emailLower,
      tenantId: tenantId,
      roleCode: formData.userType || 'Usuário de Cliente',
      status: 'ACTIVE',
      joinedAt: new Date(),
    };

    await TenantService.createMembership(membership);
  };

  const deleteUser = async (id: string) => {
    await TenantService.removeMembership(id);
  };

  return {
    fetchUsers,
    saveUser,
    linkExistingUser,
    deleteUser
  };
}
