import { useState } from 'react';

export function useProfilePageAdapter(clientId: string) {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  return { profileData, loading };
}
