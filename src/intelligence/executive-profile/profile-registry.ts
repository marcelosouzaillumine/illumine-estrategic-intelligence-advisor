import { ExecutiveProfileRecord } from './profile-types';
import { LocalProfileRepository } from './repositories/local-profile.repository';
import { AdvisoryContextService } from '../../services/advisory-context.service';

export class ProfileRegistry {
  private static repository = new LocalProfileRepository(); // Strategy could be injected here

  /**
   * Saves the profile and automatically injects it as context for the Advisory.
   */
  public static async saveProfile(record: ExecutiveProfileRecord): Promise<void> {
    
    // 1. Persist the historical record
    await this.repository.saveProfile(record);

    // 2. Inject context into Memory if it's meant for advisory consumption
    if (record.consumers.includes('advisory')) {
      AdvisoryContextService.createAndInjectContext(record);
    }
  }

  public static async getProfile(id: string): Promise<ExecutiveProfileRecord | null> {
    return this.repository.getProfileById(id);
  }

  public static async getHistory(organizationId: string, domain: string): Promise<ExecutiveProfileRecord[]> {
    return this.repository.getHistoryByOrganizationAndDomain(organizationId, domain);
  }
}
