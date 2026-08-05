export type MaturityLevel = 'experimental' | 'beta' | 'production';

export interface CapabilityInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface CapabilityOutput {
  name: string;
  type: string;
  description: string;
}

export interface GovernanceRequirement {
  type: string;
  level: string; // e.g., 'HIGH', 'STRICT'
  description: string;
}

export interface IntelligenceCapability {
  id: string;
  domain: string;
  version: string;
  maturity: MaturityLevel;
  inputs: CapabilityInput[];
  outputs: CapabilityOutput[];
  knowledgeRequired: string[];
  reasoningSupported: string[];
  supportedProtocols: string[];
  confidenceModel: string;
  governanceRequirements: GovernanceRequirement[];
}
