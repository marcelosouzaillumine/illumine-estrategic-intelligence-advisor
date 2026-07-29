import { useState } from 'react';
import { useStrategicSimulationPageAdapter } from '../adapters/ui/useStrategicSimulationPageAdapter.ts';

export function useStrategicSimulationPageViewModel({ clientId }: any) {
  const { simData, loading } = useStrategicSimulationPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('strategicsim');

  return {
    state: { simData, loading, activeTab },
    computed: { simulatedGrowthRatePct: 18.5 },
    actions: { setActiveTab }
  };
}
