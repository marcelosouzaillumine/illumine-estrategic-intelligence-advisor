import { useState } from 'react';

export function useAdvisorWorkspaceAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [workspaceData, setWorkspaceData] = useState<any>({});

  return { workspaceData, loading };
}
