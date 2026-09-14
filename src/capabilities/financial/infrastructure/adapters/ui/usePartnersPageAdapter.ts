import { useState } from 'react';

export function usePartnersPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [partnersData, setPartnersData] = useState<any[]>([]);

  return { partnersData, loading };
}
