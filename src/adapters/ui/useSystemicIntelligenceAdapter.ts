import { useState } from 'react';

export function useSystemicIntelligenceAdapter() {
  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<any[]>([]);

  return { nodes, loading };
}
