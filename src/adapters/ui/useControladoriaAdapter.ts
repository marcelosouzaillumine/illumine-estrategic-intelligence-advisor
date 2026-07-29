import { useState } from 'react';

export function useControladoriaAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState<any>({});

  return { auditData, loading };
}
