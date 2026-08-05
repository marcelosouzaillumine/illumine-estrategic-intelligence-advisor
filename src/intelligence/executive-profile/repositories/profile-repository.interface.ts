import { ExecutiveProfileRecord } from '../profile-types';

export interface ProfileRepository {
  saveProfile(profile: ExecutiveProfileRecord): Promise<void>;
  getProfileById(id: string): Promise<ExecutiveProfileRecord | null>;
  getHistoryByOrganizationAndDomain(organizationId: string, domain: string): Promise<ExecutiveProfileRecord[]>;
}
