import { useState } from 'react';

type Tab = 'integridade' | 'denuncias' | 'politicas' | 'esg';

export function useComplianceIntegrityViewModel() {
  const [activeTab, setActiveTab] = useState<Tab>('integridade');

  return {
    state: {
      activeTab,
    },
    computed: {},
    actions: {
      setActiveTab,
    },
  };
}
