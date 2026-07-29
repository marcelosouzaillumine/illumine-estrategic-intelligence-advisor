import { useState } from 'react';

export function useStrategicSimulatorAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState<any>({});

  return { inputs, loading };
}
