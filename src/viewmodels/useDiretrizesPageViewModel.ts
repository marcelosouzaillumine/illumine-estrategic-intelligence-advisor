import { useState } from 'react';
import { useDiretrizesPageAdapter } from '../adapters/ui/useDiretrizesPageAdapter.ts';

export function useDiretrizesPageViewModel({ clientId }: any) {
  const { guidelines, loading } = useDiretrizesPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('guidelines');

  return {
    state: { guidelines, loading, activeTab },
    computed: { activeGuidelinesCount: 8 },
    actions: { setActiveTab }
  };
}
