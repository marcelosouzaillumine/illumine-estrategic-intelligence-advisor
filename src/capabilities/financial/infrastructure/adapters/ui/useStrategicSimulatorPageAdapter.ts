import { useState } from 'react';

export function useStrategicSimulatorPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [simulatorData, setSimulatorData] = useState<any>({});
  return { simulatorData, loading };
}
