import { useState } from 'react';
import { useInstitutionalDeploymentReadinessPageAdapter } from '../../../adapters/ui/useInstitutionalDeploymentReadinessPageAdapter.ts';

export function useInstitutionalDeploymentReadinessPageViewModel({ clientId }: any) {
  const { readinessData, loading } = useInstitutionalDeploymentReadinessPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('readiness');

  return {
    state: { readinessData, loading, activeTab },
    computed: { isDeploymentReady: true },
    actions: { setActiveTab }
  };
}
