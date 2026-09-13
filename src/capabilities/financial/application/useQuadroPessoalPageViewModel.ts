import { useState } from 'react';
import { useQuadroPessoalPageAdapter } from '../../../adapters/ui/useQuadroPessoalPageAdapter.ts';

export function useQuadroPessoalPageViewModel({ clientId }: any) {
  const { headcountData, loading } = useQuadroPessoalPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('quadropessoal');

  return {
    state: { headcountData, loading, activeTab },
    computed: { totalEmployeesCount: 145 },
    actions: { setActiveTab }
  };
}
