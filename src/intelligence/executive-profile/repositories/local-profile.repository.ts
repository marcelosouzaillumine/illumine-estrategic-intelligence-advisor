import { ProfileRepository } from './profile-repository.interface';
import { ExecutiveProfileRecord } from '../profile-types';

export class LocalProfileRepository implements ProfileRepository {
  private getStorageKey(organizationId: string): string {
    return `illumine_profiles_${organizationId}`;
  }

  private readStorage(organizationId: string): ExecutiveProfileRecord[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(organizationId));
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private writeStorage(organizationId: string, profiles: ExecutiveProfileRecord[]): void {
    localStorage.setItem(this.getStorageKey(organizationId), JSON.stringify(profiles));
  }

  public async saveProfile(profile: ExecutiveProfileRecord): Promise<void> {
    const profiles = this.readStorage(profile.organizationId);
    
    // Check if already exists to update
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = profile;
    } else {
      profiles.push(profile);
    }

    this.writeStorage(profile.organizationId, profiles);
  }

  public async getProfileById(id: string): Promise<ExecutiveProfileRecord | null> {
    // This requires searching across all keys in local storage if orgId is unknown, 
    // but in a real DB we'd just query by ID. 
    // For MVP local storage, we'll iterate keys that match our pattern.
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('illumine_profiles_')) {
        const data = localStorage.getItem(key);
        if (data) {
          const profiles: ExecutiveProfileRecord[] = JSON.parse(data);
          const found = profiles.find(p => p.id === id);
          if (found) return found;
        }
      }
    }
    return null;
  }

  public async getHistoryByOrganizationAndDomain(organizationId: string, domain: string): Promise<ExecutiveProfileRecord[]> {
    const profiles = this.readStorage(organizationId);
    return profiles
      .filter(p => p.domain === domain)
      .sort((a, b) => new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime());
  }
}
