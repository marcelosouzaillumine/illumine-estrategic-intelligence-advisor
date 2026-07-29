import { useState } from 'react';
import { useInstitutionalReportsAdapter } from '../adapters/ui/useInstitutionalReportsAdapter.ts';

export function useInstitutionalReportsViewModel({ clientId }: any) {
  const { reportsList, loading } = useInstitutionalReportsAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      reportsList,
      loading,
      activeTab
    },
    computed: {
      totalReports: reportsList.length
    },
    actions: {
      setActiveTab
    }
  };
}
