import { useState } from 'react';
import { useQuadroPessoalAdapter } from '../../../adapters/ui/useQuadroPessoalAdapter.ts';

export function useQuadroPessoalViewModel({ clientId }: any) {
  const { employees, loading } = useQuadroPessoalAdapter(clientId);
  const [activeTab, setActiveTab] = useState('headcount');

  return {
    state: { employees, loading, activeTab },
    computed: { totalHeadcount: 45 },
    actions: { setActiveTab }
  };
}
