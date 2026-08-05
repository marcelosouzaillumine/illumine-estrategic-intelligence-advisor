import { NAVIGATION_GROUPS } from './navigation.registry';
import { WorkspaceNavigationGroup } from './navigation.types';

// Map legacy officeId to groupKey
const OFFICE_ID_TO_GROUP_KEY: Record<string, string> = {
  'ceo-office': 'navigation.group.ceo_office',
  'cfo-office': 'navigation.group.cfo_office',
  'commercial-office': 'navigation.group.commercial_office',
  'coo-office': 'navigation.group.coo_office',
  'people-office': 'navigation.group.people_office',
  'governance-office': 'navigation.group.governance_office',
  'risk-office': 'navigation.group.risk_office',
  'innovation-office': 'navigation.group.innovation_office',
  'board-office': 'navigation.group.governance_office', // Map board to governance or a specific group
  'investor-office': 'navigation.group.growth',
  'platform-workspace': 'navigation.group.platform_workspace',
  'admin': 'navigation.group.administration_workspace'
};

/**
 * Filter groups and items based on authorization (visibility, availability, masterOnly).
 * In a real implementation, this would check against the current UserContext.
 */
function applyAuthorizationFilter(groups: WorkspaceNavigationGroup[]): WorkspaceNavigationGroup[] {
  // For now, we just pass through or you can add logic like:
  // if (!user.isMaster) { items = items.filter(i => !i.masterOnly) }
  return groups;
}

/**
 * Resolves the navigation group for a specific office identifier.
 * Accepts both legacy IDs ('cfo-office') and new groupKeys ('navigation.group.cfo_office').
 */
export function resolveOfficeNavigation(officeIdentifier: string): WorkspaceNavigationGroup | undefined {
  const groups = applyAuthorizationFilter(NAVIGATION_GROUPS);
  
  // Try resolving as legacy ID first
  const groupKey = OFFICE_ID_TO_GROUP_KEY[officeIdentifier] || officeIdentifier;
  
  return groups.find(g => g.officeId === officeIdentifier || g.groupKey === groupKey);
}

/**
 * Resolves all available Executive Offices.
 * This filters out non-office groups by checking the category.
 */
export function resolveAvailableOffices(): WorkspaceNavigationGroup[] {
  const groups = applyAuthorizationFilter(NAVIGATION_GROUPS);
  
  return groups.filter(g => g.category === 'executive-office');
}

/**
 * Resolves the complete Executive Navigation architecture.
 * Groups the navigation items into logical categories.
 */
export function resolveExecutiveNavigation() {
  const groups = applyAuthorizationFilter(NAVIGATION_GROUPS);
  
  return {
    command: groups.filter(g => g.category === 'command'),
    board: groups.filter(g => g.category === 'board'),
    offices: groups.filter(g => g.category === 'executive-office'),
    intelligence: groups.filter(g => g.category === 'intelligence'),
    partner: groups.filter(g => g.category === 'partner'),
    foundation: groups.filter(g => g.category === 'foundation'),
    administration: groups.filter(g => g.category === 'administration'),
    platform: groups.filter(g => g.category === 'platform'),
  };
}

/**
 * Resolves capabilities for a specific office.
 */
export function resolveOfficeCapabilities(officeIdentifier: string) {
  const office = resolveOfficeNavigation(officeIdentifier);
  return office ? office.items : [];
}
