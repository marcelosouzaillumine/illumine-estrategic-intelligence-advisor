import { useState } from 'react';

export function useEmpresasPageAdapter() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);

  return { companies, loading };
}
