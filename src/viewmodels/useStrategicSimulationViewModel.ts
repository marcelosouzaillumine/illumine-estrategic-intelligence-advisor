import { useState } from 'react';
import { useStrategicSimulationAdapter } from '../adapters/ui/useStrategicSimulationAdapter.ts';

export function useStrategicSimulationViewModel() {
  const { simulations, loading } = useStrategicSimulationAdapter();
  const [activeTab, setActiveTab] = useState('scenarios');

  return {
    state: { simulations, loading, activeTab },
    computed: { optimisticMarginPct: 24.5 },
    actions: { setActiveTab }
  };
}
