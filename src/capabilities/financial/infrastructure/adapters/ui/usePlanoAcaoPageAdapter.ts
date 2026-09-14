import { useState } from 'react';

export function usePlanoAcaoPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [planoAcaoData, setPlanoAcaoData] = useState<any[]>([]);
  return { planoAcaoData, loading };
}
