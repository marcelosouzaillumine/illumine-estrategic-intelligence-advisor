import { useState } from 'react';
import { useInstitutionalIntegrationsPageAdapter } from '../../../adapters/ui/useInstitutionalIntegrationsPageAdapter.ts';

export function useInstitutionalIntegrationsPageViewModel({ clientId }: any) {
  const { integrationsData, loading } = useInstitutionalIntegrationsPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('integrations');

  return {
    state: { integrationsData, loading, activeTab },
    computed: { activeConnectorsCount: 12 },
    actions: { setActiveTab }
  };
}
