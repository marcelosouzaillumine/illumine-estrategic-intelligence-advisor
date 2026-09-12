export type ArchitectureOptionType = 'EXTEND_EXISTING' | 'SPLIT_CAPABILITY' | 'MERGE_BOUNDARY' | 'CREATE_NEW_COMPONENT';

export interface ArchitectureOption {
  readonly id: string;
  readonly type: ArchitectureOptionType;
  readonly description: string;
  readonly evidence: readonly string[];
  readonly expectedEffects: readonly string[];
  readonly tradeoffs: readonly string[];
  readonly confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}
