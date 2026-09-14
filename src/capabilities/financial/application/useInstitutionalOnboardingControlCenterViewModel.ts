import { useState } from 'react';
import { useInstitutionalOnboardingControlCenterAdapter } from '../../../adapters/ui/useInstitutionalOnboardingControlCenterAdapter.ts';

export function useInstitutionalOnboardingControlCenterViewModel({ clientId }: any) {
  const { onboardingData, loading } = useInstitutionalOnboardingControlCenterAdapter(clientId);
  const [activeTab, setActiveTab] = useState('steps');

  return {
    state: {
      onboardingData,
      loading,
      activeTab
    },
    computed: {
      onboardingProgressPct: 75.0
    },
    actions: {
      setActiveTab
    }
  };
}
