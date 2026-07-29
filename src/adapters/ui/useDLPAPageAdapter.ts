import { useState } from 'react';

export function useDLPAPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [dlpaData, setDlpaData] = useState<any>({});

  return { dlpaData, loading };
}
