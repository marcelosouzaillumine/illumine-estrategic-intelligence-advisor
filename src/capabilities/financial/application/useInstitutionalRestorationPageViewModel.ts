import { useState } from 'react';
import { useInstitutionalRestorationPageAdapter } from '../../../adapters/ui/useInstitutionalRestorationPageAdapter.ts';

export function useInstitutionalRestorationPageViewModel({ clientId }: any) {
  const { restorationData, loading } = useInstitutionalRestorationPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('restoration');

  return {
    state: { restorationData, loading, activeTab },
    computed: { isRestorationPointVerified: true },
    actions: { setActiveTab }
  };
}
