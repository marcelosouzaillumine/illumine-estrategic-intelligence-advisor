import { useState } from 'react';
import { useFinancialAdminDashboardAdapter } from '../adapters/ui/useFinancialAdminDashboardAdapter.ts';

export function useFinancialAdminDashboardViewModel({ clientId }: any) {
  const { adminData, loading } = useFinancialAdminDashboardAdapter(clientId);
  const [activeTab, setActiveTab] = useState('admin');

  return {
    state: { adminData, loading, activeTab },
    computed: { pendingReconciliationsCount: 0 },
    actions: { setActiveTab }
  };
}
