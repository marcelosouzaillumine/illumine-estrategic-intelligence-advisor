import { useState } from 'react';

export function useInstitutionalOnboardingControlCenterAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any[]>([]);

  return {
    onboardingData,
    loading
  };
}
