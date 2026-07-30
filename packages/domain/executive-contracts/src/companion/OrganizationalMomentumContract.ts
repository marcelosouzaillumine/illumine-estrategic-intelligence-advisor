export type MomentumCategory = 'CRITICAL' | 'SLOW' | 'STABLE' | 'STRONG' | 'EXCEPTIONAL';

export interface OrganizationalMomentumContract {
  readonly momentumId: string;
  readonly companyId: string;
  readonly momentumScore: number; // 0 to 100
  readonly momentumCategory: MomentumCategory;
  readonly executionVelocityScore: number;
  readonly adoptionRatePercent: number;
  readonly riskReductionPercent: number;
  readonly primaryDrivers: readonly string[];
  readonly primaryBlockers: readonly string[];
  readonly momentumTrend: 'ACCELERATING' | 'STABLE' | 'DECLINING';
}
