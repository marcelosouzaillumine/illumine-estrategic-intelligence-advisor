import { useState } from 'react';

export function useFiscalTributarioPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [taxData, setTaxData] = useState<any>({});

  return { taxData, loading };
}
