import { useState } from 'react';

export function useDiagnosticoAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  return {
    data,
    loading
  };
}
