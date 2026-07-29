import { useState } from 'react';

export function useInstitutionalCopilotPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [copilotData, setCopilotData] = useState<any>({});

  return { copilotData, loading };
}
