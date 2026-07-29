import { useState } from 'react';

export function usePartnersAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [partners, setPartners] = useState<any[]>([]);

  return {
    partners,
    loading
  };
}
