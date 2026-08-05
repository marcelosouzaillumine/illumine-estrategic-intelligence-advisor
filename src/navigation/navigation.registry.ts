import { NavigationItem } from './types';
import { CAPABILITIES } from '../domain/authorization/Capabilities';
import { NAVIGATION_GROUPS } from '../core/navigation/navigation.registry';

/**
 * LEGACY ADAPTER
 * This file adapts the new core navigation registry into the legacy NavigationItem format.
 * Do NOT use this for new components. Use src/core/navigation/navigation.resolver.ts instead.
 */

// Reverse map to get officeId from groupKey for legacy mapping
const GROUP_KEY_TO_OFFICE_ID: Record<string, string> = {
  'navigation.group.ceo_office': 'ceo-office',
  'navigation.group.cfo_office': 'cfo-office',
  'navigation.group.commercial_office': 'commercial-office',
  'navigation.group.coo_office': 'coo-office',
  'navigation.group.people_office': 'people-office',
  'navigation.group.governance_office': 'governance-office',
  'navigation.group.risk_office': 'risk-office',
  'navigation.group.innovation_office': 'innovation-office',
  'navigation.group.growth': 'investor-office'
};

export const NAVIGATION_REGISTRY: NavigationItem[] = NAVIGATION_GROUPS
  .filter(group => GROUP_KEY_TO_OFFICE_ID[group.groupKey]) // only map known executive offices to legacy registry
  .map(group => {
    const officeId = GROUP_KEY_TO_OFFICE_ID[group.groupKey];
    
    return {
      id: `nav-${officeId}`,
      officeId: officeId,
      capability: CAPABILITIES.EXECUTIVE_WORKSPACE_ACCESS || 'PLATFORM_ACCESS',
      route: `/executive/workspace/${officeId}`,
      labelKey: group.group,
      iconKey: 'building',
      intent: 'analyze',
      availability: 'available',
      children: group.items.map(item => ({
        id: item.id,
        capability: CAPABILITIES.EXECUTIVE_WORKSPACE_ACCESS || 'PLATFORM_ACCESS',
        route: `/executive/workspace/${officeId}/${item.id}`,
        labelKey: item.label,
        iconKey: 'activity',
        intent: 'analyze'
      }))
    } as NavigationItem;
});

// Re-export for any potential legacy consumers
export { NAVIGATION_GROUPS };
