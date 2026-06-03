import { OfficialRole } from '../../security/types';

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

export const AUDIENCE_PROFILES: Record<AudienceProfileId, AudienceProfile> = {
  BOARD_MEMBER: {
    profileId: 'BOARD_MEMBER',
    defaultDensity: 'BOARD',
    allowedDensities: ['BOARD'],
    canOverrideDensity: false
  },
  EXECUTIVE_OFFICER: {
    profileId: 'EXECUTIVE_OFFICER',
    defaultDensity: 'EXECUTIVE',
    allowedDensities: ['BOARD', 'EXECUTIVE'],
    canOverrideDensity: true
  },
  CFO: {
    profileId: 'CFO',
    defaultDensity: 'EXECUTIVE',
    allowedDensities: ['BOARD', 'EXECUTIVE', 'TECHNICAL'],
    canOverrideDensity: true
  },
  AUDITOR: {
    profileId: 'AUDITOR',
    defaultDensity: 'TECHNICAL',
    allowedDensities: ['BOARD', 'EXECUTIVE', 'TECHNICAL'],
    canOverrideDensity: true
  },
  SYSTEM_ADMIN: {
    profileId: 'SYSTEM_ADMIN',
    defaultDensity: 'TECHNICAL',
    allowedDensities: ['BOARD', 'EXECUTIVE', 'TECHNICAL'],
    canOverrideDensity: true
  }
};

export function getProfile(profileId: AudienceProfileId): AudienceProfile {
  return AUDIENCE_PROFILES[profileId] || AUDIENCE_PROFILES.BOARD_MEMBER;
}

export function mapOfficialRoleToProfileId(role: OfficialRole): AudienceProfileId {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'TENANT_ADMIN':
      return 'SYSTEM_ADMIN';
    case 'CFO':
      return 'CFO';
    case 'BOARD_MEMBER':
    case 'INVESTOR':
      return 'BOARD_MEMBER';
    case 'AUDITOR':
      return 'AUDITOR';
    case 'CONTROLLER':
      return 'AUDITOR';
    case 'ADVISOR':
    case 'OPERATIONAL_USER':
    default:
      return 'EXECUTIVE_OFFICER';
  }
}
