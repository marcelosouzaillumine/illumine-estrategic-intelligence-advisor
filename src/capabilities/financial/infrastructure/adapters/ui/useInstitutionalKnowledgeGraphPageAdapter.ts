import { useState } from 'react';

export function useInstitutionalKnowledgeGraphPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState<any>({});

  return { graphData, loading };
}
