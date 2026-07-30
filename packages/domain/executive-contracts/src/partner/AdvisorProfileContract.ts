export type AdvisorRoleType = 'STRATEGIC' | 'FINANCIAL' | 'COMMERCIAL' | 'OPERATIONAL' | 'LEGAL' | 'ESG' | 'HR';

export interface AdvisorProfileContract {
  readonly advisorId: string;
  readonly fullName: string;
  readonly primarySpecialty: AdvisorRoleType;
  readonly certificationLevel: 'ASSOCIATE' | 'PROFESSIONAL' | 'SENIOR' | 'PRINCIPAL' | 'EXECUTIVE_FELLOW';
  readonly fiduciaryScore: number;
  readonly technicalScore: number;
  readonly implementationRatePercent: number;
  readonly successRatePercent: number;
  readonly generatedROIValue: number;
  readonly npsScore: number;
}
