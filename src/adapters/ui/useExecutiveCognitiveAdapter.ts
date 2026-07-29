import { useState } from 'react';

export function useExecutiveCognitiveAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [cognitiveInsights, setCognitiveInsights] = useState<any[]>([]);

  return {
    cognitiveInsights,
    loading
  };
}
