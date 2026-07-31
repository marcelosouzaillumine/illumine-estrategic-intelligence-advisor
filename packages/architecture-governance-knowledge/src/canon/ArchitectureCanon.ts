export interface ArchitectureCanon {
  readonly version: string;
  readonly registeredDomains: readonly string[];
  readonly registeredCapabilities: readonly string[];
  readonly registeredRules: readonly string[];
  readonly registeredConstitutions: readonly string[];
  readonly registeredCertifications: readonly string[];
  readonly registeredPatterns: readonly string[];
  readonly registeredComponents: readonly string[];
  readonly registeredDecisions: readonly string[];
}
