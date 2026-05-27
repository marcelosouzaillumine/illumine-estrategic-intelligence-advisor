import { ExecutiveIntelligenceReport } from '../runtime/executive-intelligence-runtime';

export interface CommunicationProfilePreference {
  id: string;
  name: string;
  narrativeVerbosity: 'CONCISE' | 'SUMMARY' | 'DETAILED';
  tableDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  primaryFocus: 'STRATEGIC_HIGHLIGHTS' | 'FINANCIAL_METRICS' | 'CAUSALITY_ROOT_CAUSES' | 'AUDIT_LINEAGE' | 'OPERATIONAL_STATUS';
  showAuditTrail: boolean;
  showStressedFactors: boolean;
}

export const CEO_PROFILE: CommunicationProfilePreference = {
  id: 'CEO_PROFILE',
  name: 'Chief Executive Officer (CEO)',
  narrativeVerbosity: 'SUMMARY',
  tableDensity: 'MEDIUM',
  primaryFocus: 'STRATEGIC_HIGHLIGHTS',
  showAuditTrail: true,
  showStressedFactors: true,
};

export const BOARD_PROFILE: CommunicationProfilePreference = {
  id: 'BOARD_PROFILE',
  name: 'Conselho de Administração (Board)',
  narrativeVerbosity: 'CONCISE',
  tableDensity: 'LOW',
  primaryFocus: 'STRATEGIC_HIGHLIGHTS',
  showAuditTrail: true,
  showStressedFactors: true,
};

export const INVESTOR_PROFILE: CommunicationProfilePreference = {
  id: 'INVESTOR_PROFILE',
  name: 'Investidores e Acionistas',
  narrativeVerbosity: 'SUMMARY',
  tableDensity: 'MEDIUM',
  primaryFocus: 'FINANCIAL_METRICS',
  showAuditTrail: false,
  showStressedFactors: true,
};

export const ADVISOR_PROFILE: CommunicationProfilePreference = {
  id: 'ADVISOR_PROFILE',
  name: 'Advisors e Consultores',
  narrativeVerbosity: 'DETAILED',
  tableDensity: 'HIGH',
  primaryFocus: 'CAUSALITY_ROOT_CAUSES',
  showAuditTrail: true,
  showStressedFactors: true,
};

export const OPERATIONAL_PROFILE: CommunicationProfilePreference = {
  id: 'OPERATIONAL_PROFILE',
  name: 'Gerência Operacional',
  narrativeVerbosity: 'DETAILED',
  tableDensity: 'HIGH',
  primaryFocus: 'OPERATIONAL_STATUS',
  showAuditTrail: false,
  showStressedFactors: false,
};

export class ExecutiveCommunicationProfiles {
  private static readonly PROFILES: Record<string, CommunicationProfilePreference> = {
    CEO_PROFILE,
    BOARD_PROFILE,
    INVESTOR_PROFILE,
    ADVISOR_PROFILE,
    OPERATIONAL_PROFILE,
  };

  public static getProfile(profileId: string): CommunicationProfilePreference {
    return this.PROFILES[profileId] || BOARD_PROFILE;
  }

  public static listProfiles(): CommunicationProfilePreference[] {
    return Object.values(this.PROFILES);
  }

  /**
   * Passive formatter that returns text summaries tailored to profile preference.
   * STRICTLY PASSIVE: It only slices or filters texts, NEVER alters computed values.
   */
  public static formatSummary(report: ExecutiveIntelligenceReport, profileId: string): string {
    const pref = this.getProfile(profileId);
    const summary = report.advisory?.executiveSummary || '';

    if (pref.narrativeVerbosity === 'CONCISE') {
      // Split by sentences and take first 2-3 sentences.
      const sentences = summary.split(/[.!?]\s+/);
      return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
    } else if (pref.narrativeVerbosity === 'SUMMARY') {
      const sentences = summary.split(/[.!?]\s+/);
      return sentences.slice(0, 4).join('. ') + (sentences.length > 4 ? '.' : '');
    }

    return summary;
  }
}
