import { useState } from 'react';
import { useEstruturaGovernancaPageAdapter } from '../adapters/ui/useEstruturaGovernancaPageAdapter.ts';

export function useEstruturaGovernancaPageViewModel({ clientId }: any) {
  const { governanceStructure, loading } = useEstruturaGovernancaPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('structure');

  return {
    state: { governanceStructure, loading, activeTab },
    computed: { governanceMaturityIndex: 96.0 },
    actions: { setActiveTab }
  };
}
