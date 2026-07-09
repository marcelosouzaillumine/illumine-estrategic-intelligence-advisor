import { useInstitutionalAuth } from '../../core/security/auth/InstitutionalAuthProvider';
import { login, logout } from '../../lib/firebase';

export function useSidebarAuthAdapter() {
  const { session } = useInstitutionalAuth();
  return { session, login, logout };
}

export interface SidebarUser {
  photoURL?: string | null;
  displayName?: string | null;
}
