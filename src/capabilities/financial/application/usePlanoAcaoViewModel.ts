import { useState } from 'react';
import { usePlanoAcaoAdapter } from '../../../adapters/ui/usePlanoAcaoAdapter.ts';

export function usePlanoAcaoViewModel({ clientId }: any) {
  const { actions, loading } = usePlanoAcaoAdapter(clientId);
  const [activeTab, setActiveTab] = useState('kanban');

  return {
    state: {
      actions,
      loading,
      activeTab
    },
    computed: {
      completedActionsPct: 75.0
    },
    actions: {
      setActiveTab
    }
  };
}
