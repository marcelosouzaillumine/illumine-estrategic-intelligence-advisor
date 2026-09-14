import { useState } from 'react';

export function usePreferencesAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState<any>({});

  return {
    preferences,
    loading
  };
}
