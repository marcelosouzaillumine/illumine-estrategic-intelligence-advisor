import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';
import { login, logout } from '../../lib/firebase';

export function useSidebarAuthAdapter() {
  const { session, activateTenant } = useInstitutionalAuth();
  
  const clients = session?.availableTenants?.map(t => ({ 
    id: t.tenantId, 
    name: t.name || t.tenantId,
    fantasia: t.name || t.tenantId,
    razao: t.name || t.tenantId,
    logo: t.logo || null,
    icon: t.icon || t.logo || null,
    segmento: t.segmento || t.segmentoAtuacao || ''
  })) || [];
  const selectedClient = session?.tenantId || '';
  const handleSelectClient = (id: string) => activateTenant(id);

  return { session, login, logout, clients, selectedClient, handleSelectClient };
}

export interface SidebarUser {
  photoURL?: string | null;
  displayName?: string | null;
}
