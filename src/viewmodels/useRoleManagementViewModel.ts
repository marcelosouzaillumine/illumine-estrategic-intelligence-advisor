import { useState } from 'react';
import { useRoleManagementAdapter } from '../adapters/ui/useRoleManagementAdapter.ts';

export function useRoleManagementViewModel({ clientId }: any) {
  const { roles, loading } = useRoleManagementAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: { roles, loading, activeTab },
    computed: { totalRoles: 8 },
    actions: { setActiveTab }
  };
}
