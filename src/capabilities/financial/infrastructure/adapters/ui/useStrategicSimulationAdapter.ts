import { useState } from 'react';

export function useStrategicSimulationAdapter() {
  const [loading, setLoading] = useState(false);
  const [simulations, setSimulations] = useState<any[]>([]);

  return { simulations, loading };
}
