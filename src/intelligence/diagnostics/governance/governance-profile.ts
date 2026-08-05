import { ExecutiveIntelligenceProfile } from '../models/executive-intelligence-profile';

/**
 * The output of the Governance Intelligence Diagnostic.
 */
export interface GovernanceIntelligenceProfile extends ExecutiveIntelligenceProfile {
  signature: {
    predominantProfile: string;
    institutionalCapacity: string;
    identifiedCapabilities: string[];
    evolutionVectors: string[];
  };
}
