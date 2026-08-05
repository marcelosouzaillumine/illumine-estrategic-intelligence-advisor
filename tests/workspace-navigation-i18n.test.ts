import { renderHook } from '@testing-library/react';
import { useWorkspaceNavigation } from '../src/core/navigation/hooks/useWorkspaceNavigation';


jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => `translated_${key}`,
    i18n: { language: 'pt-BR' }
  }),
}));

describe('useWorkspaceNavigation hook', () => {
  it('should filter items based on permissions if not master', () => {
    const userPermissions = ['My Executive Workspace:EFOS'];
    const { result } = renderHook(() => useWorkspaceNavigation(
      userPermissions,
      false, // isPartner
      false, // isMaster
      (cap) => false // can() returns false
    ));

    const groups = result.current;
    
    // Should only contain the group that has the permitted item
    const efosGroup = groups.find(g => g.items.some(i => i.id === 'efos'));
    expect(efosGroup).toBeDefined();
    
    // Other masterOnly groups like 'Executive Command Center' should be missing
    const cmdCenter = groups.find(g => g.groupKey === 'navigation.group.executive_command_center');
    expect(cmdCenter).toBeUndefined();
  });
});
