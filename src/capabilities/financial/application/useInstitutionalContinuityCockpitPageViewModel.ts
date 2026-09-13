import { useState } from 'react';
import { useInstitutionalContinuityCockpitPageAdapter } from '../../../adapters/ui/useInstitutionalContinuityCockpitPageAdapter.ts';

export function useInstitutionalContinuityCockpitPageViewModel({ clientId }: any) {
  const { continuityData, loading } = useInstitutionalContinuityCockpitPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('continuity');

  return {
    state: { continuityData, loading, activeTab },
    computed: { businessContinuityScore: 97.5 },
    actions: { setActiveTab }
  };
}
