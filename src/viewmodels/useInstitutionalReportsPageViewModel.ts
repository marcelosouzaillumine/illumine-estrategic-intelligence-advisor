import { useState } from 'react';
import { useInstitutionalReportsPageAdapter } from '../adapters/ui/useInstitutionalReportsPageAdapter.ts';

export function useInstitutionalReportsPageViewModel({ clientId }: any) {
  const { reportsData, loading } = useInstitutionalReportsPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('reports');

  return {
    state: { reportsData, loading, activeTab },
    computed: { totalReportsGenerated: 42 },
    actions: { setActiveTab }
  };
}
