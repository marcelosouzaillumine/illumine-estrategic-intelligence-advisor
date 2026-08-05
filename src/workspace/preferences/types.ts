export interface WorkspacePreferences {
  favoriteOffice: string;
  initialSurface: string;
  layoutPreference: 'compact' | 'comfortable' | 'expanded';
  favoriteWidgets: string[];
  lastAnalyzedDecision: string | null;
}
