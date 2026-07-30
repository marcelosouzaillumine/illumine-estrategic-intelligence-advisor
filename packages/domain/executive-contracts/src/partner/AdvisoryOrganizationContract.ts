export interface AdvisoryOrganizationContract {
  readonly organizationId: string;
  readonly name: string;
  readonly branding: {
    readonly logoUrl?: string;
    readonly primaryColor: string;
    readonly customDomain?: string;
  };
  readonly memberCount: number;
  readonly specializationSectors: readonly string[];
  readonly certificationLevel: 'ASSOCIATE' | 'PROFESSIONAL' | 'SENIOR' | 'PRINCIPAL' | 'EXECUTIVE_FELLOW';
}
