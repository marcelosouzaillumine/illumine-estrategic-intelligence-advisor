import { useState } from 'react';

export function useInstitutionalOnboardingControlCenterPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>({});

  return { onboardingData, loading };
}
