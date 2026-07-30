import { InstitutionalMemoryType } from './InstitutionalMemoryType';

export interface InstitutionalWisdomObject {
  readonly wisdomId: string;
  readonly memoryType: InstitutionalMemoryType;
  readonly decisionId: string;
  readonly observedOutcomeDeltaPercent: number;
  readonly confidenceAdjustment: number;
  readonly causalLearningStatement: string;
  readonly governanceImpact: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly applicabilityScope: readonly string[];
  readonly createdAt: string;
  readonly wisdomHash: string;
}
