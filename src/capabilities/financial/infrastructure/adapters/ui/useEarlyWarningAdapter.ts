import { useState } from 'react';

export function useEarlyWarningAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<any[]>([]);

  return {
    warnings,
    loading
  };
}
