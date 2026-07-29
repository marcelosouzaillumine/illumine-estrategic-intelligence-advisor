import { useState } from 'react';

export function useDREAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [dreData, setDreData] = useState<any[]>([]);

  return {
    dreData,
    loading
  };
}
