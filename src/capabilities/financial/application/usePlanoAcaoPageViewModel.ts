import { useState } from 'react';
import { usePlanoAcaoPageAdapter } from '../../../adapters/ui/usePlanoAcaoPageAdapter.ts';

export function usePlanoAcaoPageViewModel({ clientId }: any) {
  const { planoAcaoData, loading } = usePlanoAcaoPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('planoacao');

  return {
    state: { planoAcaoData, loading, activeTab },
    computed: { actionsCompletionPct: 92.3 },
    actions: { setActiveTab }
  };
}
