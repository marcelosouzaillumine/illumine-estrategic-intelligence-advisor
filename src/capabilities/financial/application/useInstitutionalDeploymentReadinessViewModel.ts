import { useState } from 'react';
import { useInstitutionalDeploymentReadinessAdapter } from '../../../adapters/ui/useInstitutionalDeploymentReadinessAdapter.ts';

export function useInstitutionalDeploymentReadinessViewModel({ clientId }: any) {
  const { readinessData, loading } = useInstitutionalDeploymentReadinessAdapter(clientId);
  const [activeTab, setActiveTab] = useState('readiness');

  return {
    state: {
      readinessData,
      loading,
      activeTab
    },
    computed: {
      readinessScore: 88.0
    },
    actions: {
      setActiveTab
    }
  };
}
