import { useState } from 'react';
import { useEmpresasPageAdapter } from '../adapters/ui/useEmpresasPageAdapter.ts';

export function useEmpresasPageViewModel() {
  const { companies, loading } = useEmpresasPageAdapter();
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: { companies, loading, activeTab },
    computed: { activeCompaniesCount: 12 },
    actions: { setActiveTab }
  };
}
