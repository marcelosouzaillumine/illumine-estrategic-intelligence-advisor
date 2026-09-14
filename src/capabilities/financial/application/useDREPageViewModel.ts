import { useState } from 'react';
import { useDREPageAdapter } from '../../../adapters/ui/useDREPageAdapter.ts';

export function useDREPageViewModel({ clientId }: any) {
  const { dreData, loading } = useDREPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('dre');

  return {
    state: { dreData, loading, activeTab },
    computed: { ebitdaMarginPct: 22.4 },
    actions: { setActiveTab }
  };
}
