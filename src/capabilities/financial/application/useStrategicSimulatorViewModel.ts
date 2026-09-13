import { useState } from 'react';
import { useStrategicSimulatorAdapter } from '../../../adapters/ui/useStrategicSimulatorAdapter.ts';

export function useStrategicSimulatorViewModel({ clientId }: any) {
  const { inputs, loading } = useStrategicSimulatorAdapter(clientId);
  const [activeTab, setActiveTab] = useState('variables');

  return {
    state: { inputs, loading, activeTab },
    computed: { simulatedValuation: 18500000.0 },
    actions: { setActiveTab }
  };
}
