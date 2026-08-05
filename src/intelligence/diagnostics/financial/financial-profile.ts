import { ExecutiveIntelligenceProfile } from '../models/executive-intelligence-profile';

export interface FinancialIntelligenceProfile extends ExecutiveIntelligenceProfile {
  // We can add specific financial fields here in the future if needed,
  // such as specific metric flags, but for now it leverages the base profile.
}
