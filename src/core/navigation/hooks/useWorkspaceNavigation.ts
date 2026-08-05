import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NAVIGATION_GROUPS } from '../navigation.registry';
import { WorkspaceNavigationGroup, WorkspaceNavigationItem } from '../navigation.types';

export function useWorkspaceNavigation(
  userPermissions: string[] | null,
  isPartner: boolean,
  isMaster: boolean,
  can: (capability: any) => any
): WorkspaceNavigationGroup[] {
  const { t, i18n } = useTranslation(['navigation', 'common']);

  const sortNavItems = (items: WorkspaceNavigationItem[]): WorkspaceNavigationItem[] => {
    return [...items]
      .map(item => ({
        ...item,
        children: item.children ? sortNavItems(item.children) : undefined
      }))
      .sort((a, b) => {
        if (a.id === 'consolidated_executive') return -1;
        if (b.id === 'consolidated_executive') return 1;

        const labelA = t(a.labelKey, a.label);
        const labelB = t(b.labelKey, b.label);

        const isADashboard = labelA.toLowerCase().includes('dashboard');
        const isBDashboard = labelB.toLowerCase().includes('dashboard');

        if (isADashboard && !isBDashboard) return -1;
        if (!isADashboard && isBDashboard) return 1;

        return labelA.localeCompare(labelB, i18n.language);
      });
  };

  const groups = useMemo(() => {
    return NAVIGATION_GROUPS.map(group => {
      const filteredItems = group.items.filter(item => {
        if (item.masterOnly && !isMaster) return false;
        if (item.id === 'observability_console') {
          if (!can('SYSTEM.OBSERVABILITY.VIEW')) return false;
        }
        if (isPartner && item.id === 'portfolio') return true;
        if (!userPermissions || isMaster) return true;
        const permissionKey = `${group.group}:${item.label}`;
        return userPermissions.includes(permissionKey);
      });

      return {
        ...group,
        groupKey: group.groupKey,
        items: sortNavItems(filteredItems)
      };
    }).filter(group => group.items.length > 0);
  }, [t, i18n.language, userPermissions, isMaster, isPartner, can]);

  return groups;
}
