export interface PartnerDistributionContract {
  readonly distributionId: string;
  readonly partnerId: string;
  readonly targetCompanyId: string;
  readonly matchedSpecialty: string;
  readonly matchedGeographicRegion: string;
  readonly matchedIndustryVertical: string;
  readonly matchingScore: number;
  readonly status: 'MATCHED' | 'ASSIGNED' | 'ACTIVE' | 'REJECTED';
}
