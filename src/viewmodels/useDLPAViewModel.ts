import { useState } from 'react';
import { useDLPAAdapter } from '../adapters/ui/useDLPAAdapter';

export function useDLPAViewModel({ clientId }: any) {
  const { dlpaData, loading } = useDLPAAdapter(clientId);
  const [activeTab, setActiveTab] = useState('dlpa');

  return {
    state: {
      dlpaData,
      loading,
      activeTab
    },
    computed: {
      netIncome: 0
    },
    actions: {
      setActiveTab
    }
  };
}
