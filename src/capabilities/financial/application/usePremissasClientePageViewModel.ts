import { useState } from 'react';
import { usePremissasClientePageAdapter } from '../../../adapters/ui/usePremissasClientePageAdapter.ts';

export function usePremissasClientePageViewModel({ clientId }: any) {
  const { assumptionsData, loading } = usePremissasClientePageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('premissascliente');

  return {
    state: { assumptionsData, loading, activeTab },
    computed: { isClientAssumptionsValidated: true },
    actions: { setActiveTab }
  };
}
