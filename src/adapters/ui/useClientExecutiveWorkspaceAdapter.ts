import { useState } from 'react';

export function useClientExecutiveWorkspaceAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [workspaceInfo, setWorkspaceInfo] = useState<any>({});

  return { workspaceInfo, loading };
}
