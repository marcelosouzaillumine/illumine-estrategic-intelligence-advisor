import { ROLE_LANDING_REGISTRY } from '../auth/role-landing.registry';
import { NAVIGATION_SURFACE_REGISTRY } from './navigation-surface.registry';

export interface LandingResolution {
  role: string;
  workspace: string;
  office?: string;
  surface?: string;
  route: string;
}

/**
 * Resolves the default landing configuration based on the user's roles.
 * Picks the first resolved role. In a real system, you might have role priorities.
 */
export function resolveLandingRoute(roles: string[]): LandingResolution {
  if (!roles || roles.length === 0) {
    return {
      role: 'Unknown',
      workspace: 'EXECUTIVE',
      route: '/executive/workspace'
    };
  }

  // 1. Find the primary role definition
  let roleDef = null;
  let primaryRole = '';
  
  for (const r of roles) {
    if (ROLE_LANDING_REGISTRY[r]) {
      roleDef = ROLE_LANDING_REGISTRY[r];
      primaryRole = r;
      break;
    }
  }

  // If no known role found, fallback
  if (!roleDef) {
    return {
      role: roles[0],
      workspace: 'EXECUTIVE',
      route: '/executive/workspace'
    };
  }

  // 2. Resolve surface route from Surface Registry if applicable
  let route = roleDef.fallbackRoute;
  let officeId = undefined;

  if (roleDef.context === 'PLATFORM') {
    // Projeção da Constituição para usuários internos (PoC)
    // No futuro, isso será abstraído na Projection API formal
    const { ConstitutionResolver } = require('../constitution/constitution.resolver');
    const workspace = ConstitutionResolver.getWorkspace('platform');
    
    if (workspace && roleDef.surfaceId) {
      // Se houver workspace e surface correspondente
      const surfaceDef = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === roleDef?.surfaceId);
      if (surfaceDef) {
        route = surfaceDef.route;
        officeId = surfaceDef.officeId;
      }
    }
  } else if (roleDef.surfaceId) {
    // Modo Legacy para os Executive Offices dos clientes
    const surfaceDef = NAVIGATION_SURFACE_REGISTRY.find(s => s.surfaceId === roleDef?.surfaceId);
    if (surfaceDef) {
      route = surfaceDef.route;
      officeId = surfaceDef.officeId;
    }
  }

  // 3. Return the full resolution
  return {
    role: primaryRole,
    workspace: roleDef.context,
    office: officeId,
    surface: roleDef.surfaceId,
    route
  };
}
