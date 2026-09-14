import { useState } from 'react';
import { useStrategicGoalsAdapter } from '../../../adapters/ui/useStrategicGoalsAdapter.ts';

export function useStrategicGoalsViewModel({ clientId }: any) {
  const { goals, loading } = useStrategicGoalsAdapter(clientId);
  const [activeTab, setActiveTab] = useState('list');

  return {
    state: {
      goals,
      loading,
      activeTab
    },
    computed: {
      strategicGoalsCount: goals.length
    },
    actions: {
      setActiveTab
    }
  };
}
