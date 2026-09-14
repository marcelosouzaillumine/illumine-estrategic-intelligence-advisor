import { useState } from 'react';

export function usePlanoAcaoAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [actions, setActions] = useState<any[]>([]);

  return {
    actions,
    loading
  };
}
