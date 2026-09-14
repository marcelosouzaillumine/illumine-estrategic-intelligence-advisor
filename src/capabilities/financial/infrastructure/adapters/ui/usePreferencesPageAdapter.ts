import { useState } from 'react';

export function usePreferencesPageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [preferencesData, setPreferencesData] = useState<any>({});
  return { preferencesData, loading };
}
