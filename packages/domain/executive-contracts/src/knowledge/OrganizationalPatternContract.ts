export type PatternDomain = 'FINANCIAL' | 'COMMERCIAL' | 'GOVERNANCE' | 'OPERATIONAL';
export type PatternSeverity = 'CRITICAL' | 'WARNING' | 'OPPORTUNITY';

export interface OrganizationalPatternContract {
  readonly patternId: string;
  readonly companyId: string;
  readonly domain: PatternDomain;
  readonly patternTitle: string;
  readonly description: string;
  readonly triggers: readonly string[];
  readonly severity: PatternSeverity;
  readonly detectedAtTimestamp: string;
  readonly historicalFrequency: number;
}
