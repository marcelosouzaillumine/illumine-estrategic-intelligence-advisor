import { useState } from 'react';
import { useEarlyWarningAdapter } from '../../../adapters/ui/useEarlyWarningAdapter';

export function useEarlyWarningViewModel({ clientId }: any) {
  const { warnings, loading } = useEarlyWarningAdapter(clientId);
  const [activeTab, setActiveTab] = useState('warnings');

  return {
    state: {
      warnings,
      loading,
      activeTab
    },
    computed: {
      alertLevel: 'NORMAL'
    },
    actions: {
      setActiveTab
    }
  };
}
