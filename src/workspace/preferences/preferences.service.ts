import { WorkspacePreferences } from './types';
import { WorkspaceCacheService } from '../data/cache/workspace-cache.service';

const PREFS_CACHE_KEY = 'user:preferences';

const DEFAULT_PREFERENCES: WorkspacePreferences = {
  favoriteOffice: 'cfo',
  initialSurface: '/executive/workspace/cfo-office/cash-governance',
  layoutPreference: 'comfortable',
  favoriteWidgets: [],
  lastAnalyzedDecision: null,
};

export class PreferencesService {
  static async getPreferences(): Promise<WorkspacePreferences> {
    const cached = await WorkspaceCacheService.get<WorkspacePreferences>(PREFS_CACHE_KEY, { category: 'session' });
    if (cached) return cached;
    return DEFAULT_PREFERENCES;
  }

  static async updatePreferences(updates: Partial<WorkspacePreferences>): Promise<WorkspacePreferences> {
    const current = await this.getPreferences();
    const updated = { ...current, ...updates };
    await WorkspaceCacheService.set(PREFS_CACHE_KEY, updated, { category: 'session' });
    return updated;
  }
}
