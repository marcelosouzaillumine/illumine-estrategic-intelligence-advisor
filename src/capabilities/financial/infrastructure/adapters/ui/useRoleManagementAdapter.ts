import { useState } from 'react';

export function useRoleManagementAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);

  return { roles, loading };
}
