import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LEGACY_MIGRATION_REGISTRY } from '../../navigation/legacy-route.registry';

export interface SemanticRouteMatch {
  isLegacyUrl: boolean;
  officeId: string | null;
  surfaceId: string | null;
}

/**
 * Hook to translate a legacy dashboard URL into an Executive Context.
 */
export function useExecutiveRouteResolver(): SemanticRouteMatch {
  const location = useLocation();
  const [match, setMatch] = useState<SemanticRouteMatch>({
    isLegacyUrl: false,
    officeId: null,
    surfaceId: null
  });

  useEffect(() => {
    const path = location.pathname;
    
    // Check if we are on a legacy route
    if (path.startsWith('/dashboard/')) {
      // Map legacy paths to specific surface mappings
      // For instance: /dashboard/dre -> dre
      // Or in this app's case, it might just rely on the 'currentPage' state if the URL isn't deeply updated.
      // Assuming 'dre' is mapped to 'cfo-office' and 'nav-finance-dre'
      
      const leaf = path.split('/').pop();
      const registryMatch = LEGACY_MIGRATION_REGISTRY.find(m => m.legacyRoute === leaf);

      if (registryMatch) {
        const [officeId, surfaceId] = registryMatch.id.split('/');
        setMatch({
          isLegacyUrl: true,
          officeId,
          surfaceId
        });
        return;
      }
      
      // Fallback manual matching if registry doesn't match by leaf
      if (path.includes('/dashboard/financeiro')) {
        setMatch({
          isLegacyUrl: true,
          officeId: 'cfo-office',
          surfaceId: 'performance' // Default surface for the office
        });
        return;
      }

      setMatch({
        isLegacyUrl: true,
        officeId: null,
        surfaceId: null
      });
    } else {
      setMatch({
        isLegacyUrl: false,
        officeId: null,
        surfaceId: null
      });
    }

  }, [location.pathname]);

  return match;
}
