import { ExecutiveIntelligenceProfile } from '../models/executive-intelligence-profile';

export interface SampleIntelligenceProfile extends ExecutiveIntelligenceProfile {
  // Add specific sample data if needed
  isSample: boolean;
}
