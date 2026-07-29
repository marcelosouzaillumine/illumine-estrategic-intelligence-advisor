export enum Maturity {
  EXPERIMENTAL = 'EXPERIMENTAL',
  PROTOTYPE = 'PROTOTYPE',
  VALIDATED = 'VALIDATED',
  PRODUCTION = 'PRODUCTION',
  CERTIFIED = 'CERTIFIED'
}

export enum Stability {
  VOLATILE = 'VOLATILE',
  EVOLVING = 'EVOLVING',
  STABLE = 'STABLE',
  FROZEN = 'FROZEN',
  CANONICAL = 'CANONICAL'
}

export interface CapabilityDependencyGraph {
  readonly dependencyContracts: string[];
  readonly dependencyCapabilities: string[];
}

export interface CapabilityManifest {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly maturity: Maturity;
  readonly stability: Stability;
  readonly dependencies: CapabilityDependencyGraph;
  readonly cognitiveProfile: {
    readonly reasoning: boolean;
    readonly prediction: boolean;
    readonly recommendation: boolean;
    readonly explanation: boolean;
  };
  readonly governance: {
    readonly explainabilityScore: number;
    readonly confidenceThreshold: number;
  };
}

export interface CapabilityMetadata {
  readonly manifest: CapabilityManifest;
  readonly registeredAt: string;
  readonly owner: string;
}
