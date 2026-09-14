import { useState } from 'react';

export function useDLPAAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [dlpaData, setDlpaData] = useState<any[]>([]);

  return {
    dlpaData,
    loading
  };
}
