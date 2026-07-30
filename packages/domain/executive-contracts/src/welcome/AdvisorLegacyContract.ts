export interface AdvisorLegacyContract {
  readonly legacyId: string;
  readonly activeOrganizationsCount: number;
  readonly daysInAdvisoryPeriod: number;
  readonly totalCashPreservedValueFormatted: string;
  readonly legacyNarrativeText: string;
}
