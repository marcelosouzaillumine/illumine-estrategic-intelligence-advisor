export type ConciergeAudience = 'executive' | 'advisor' | 'client' | 'unknown';

export interface GovernancePolicyGuard {
  allowedInformationLevels: number[];
  canRevealProprietaryLogic: boolean;
  canAccessInternalSystems: boolean;
}

export const PublicConciergePolicy: GovernancePolicyGuard = {
  allowedInformationLevels: [1], // Only Level 1 - Public (positioning, domains, benefits)
  canRevealProprietaryLogic: false,
  canAccessInternalSystems: false,
};

export const AuthenticatedConciergePolicy: GovernancePolicyGuard = {
  allowedInformationLevels: [1, 2], // Level 1 and 2 - Auth (analytics, recommendations, plans)
  canRevealProprietaryLogic: false,
  canAccessInternalSystems: true,
};

/**
 * Checks if a specific requested intent is allowed under the current policy
 */
export function isActionAllowed(intentLevel: number, policy: GovernancePolicyGuard): boolean {
  return policy.allowedInformationLevels.includes(intentLevel);
}
