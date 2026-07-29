import { useState } from 'react';
import { useStrategicSimulatorPageAdapter } from '../adapters/ui/useStrategicSimulatorPageAdapter.ts';

export function useStrategicSimulatorPageViewModel({ clientId }: any) {
  const { simulatorData, loading } = useStrategicSimulatorPageAdapter(clientId);
  const [activeTab, setActiveTab] = useState('strategicsimulator');

  return {
    state: { simulatorData, loading, activeTab },
    computed: { simulatedEbitdaMarginPct: 22.4 },
    actions: { setActiveTab }
  };
}
