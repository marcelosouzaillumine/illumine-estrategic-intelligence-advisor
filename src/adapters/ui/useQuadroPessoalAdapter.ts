import { useState } from 'react';

export function useQuadroPessoalAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  return { employees, loading };
}
