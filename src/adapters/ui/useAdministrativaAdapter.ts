import { useState } from 'react';

export function useAdministrativaAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [adminData, setAdminData] = useState<any[]>([]);

  return { adminData, loading };
}
