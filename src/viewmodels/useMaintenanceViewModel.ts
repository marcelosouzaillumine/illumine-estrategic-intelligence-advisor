import { useState } from 'react';
import { useMaintenanceAdapter } from '../adapters/ui/useMaintenanceAdapter.ts';

export function useMaintenanceViewModel() {
  const { pendingDocs, loadingDocs, role, handleApprove, handleReject, purgeMockupData } = useMaintenanceAdapter();
  const [activeTab, setActiveTab] = useState('system');

  return {
    state: {
      pendingDocs,
      loadingDocs,
      role,
      activeTab
    },
    computed: {
      hasPending: pendingDocs.length > 0
    },
    actions: {
      setActiveTab,
      handleApprove,
      handleReject,
      purgeMockupData
    }
  };
}
