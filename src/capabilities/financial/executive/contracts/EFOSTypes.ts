// src/services/EFOSTypes.ts

// Types used by the EFOS UI layer, extracted from core runtime to avoid direct runtime imports.

export type PresentationLayer = 'BOARD' | 'EXECUTIVE' | 'TECHNICAL';

export type AudienceProfileId =
  | 'BOARD_MEMBER'
  | 'EXECUTIVE_OFFICER'
  | 'CFO'
  | 'AUDITOR'
  | 'SYSTEM_ADMIN';

export interface AudienceProfile {
  profileId: AudienceProfileId;
  defaultDensity: PresentationLayer;
  allowedDensities: PresentationLayer[];
  canOverrideDensity: boolean;
}
