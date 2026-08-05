export interface CapabilityManifest {
  capabilityId: string;
  version: string;
  indicatorsSupported: string[];
  dependencies: string[];
  requiredKnowledge: string[];
  minimumRuntimeVersion: string;
  supportedOntologyVersion: string;
  coverageScore: number;
}
