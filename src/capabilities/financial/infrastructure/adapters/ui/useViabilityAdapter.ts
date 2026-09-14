import { useState } from 'react';

export function useViabilityAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);

  return { projects, loading };
}
