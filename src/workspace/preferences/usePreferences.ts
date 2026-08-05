import { useState, useEffect } from 'react';
import { WorkspacePreferences } from './types';
import { PreferencesService } from './preferences.service';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<WorkspacePreferences | null>(null);

  useEffect(() => {
    PreferencesService.getPreferences().then(setPreferences);
  }, []);

  const updatePreferences = async (updates: Partial<WorkspacePreferences>) => {
    const newPrefs = await PreferencesService.updatePreferences(updates);
    setPreferences(newPrefs);
  };

  return {
    preferences,
    updatePreferences,
    isLoading: preferences === null
  };
};
