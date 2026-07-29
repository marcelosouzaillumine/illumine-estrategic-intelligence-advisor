import { useState } from 'react';
import { useFiscalTributarioPageAdapter } from '../adapters/ui/useFiscalTributarioPageAdapter.ts';

export function useFiscalTributarioPageViewModel({ clientId }: any) {
  const { taxData, loading } = useFiscalTributarioPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('tax');

  return {
    state: { taxData, loading, activeTab },
    computed: { effectiveTaxRatePct: 14.8 },
    actions: { setActiveTab }
  };
}
