import { useState } from 'react';
import { useInstitutionalOnboardingControlCenterPageAdapter } from '../adapters/ui/useInstitutionalOnboardingControlCenterPageAdapter.ts';

export function useInstitutionalOnboardingControlCenterPageViewModel({ clientId }: any) {
  const { onboardingData, loading } = useInstitutionalOnboardingControlCenterPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('onboarding');

  return {
    state: { onboardingData, loading, activeTab },
    computed: { onboardingProgressPct: 100.0 },
    actions: { setActiveTab }
  };
}
