import { useState } from 'react';

export function useProfileAdapter() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>({});

  return { profile, loading };
}
