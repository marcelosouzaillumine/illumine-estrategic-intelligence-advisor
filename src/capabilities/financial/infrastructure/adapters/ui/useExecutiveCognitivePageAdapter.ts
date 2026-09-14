import { useState } from 'react';

export function useExecutiveCognitivePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [cognitiveInsights, setCognitiveInsights] = useState<any[]>([]);

  return { cognitiveInsights, loading };
}
