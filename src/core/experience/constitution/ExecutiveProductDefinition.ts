import { ExecutiveOffice } from '../governance/offices/ExecutiveOffice';
import { ExecutiveProductType, AdvisoryLevel } from '../products/ExecutiveProductType';

export interface ExecutiveExperienceLayer {
  id: string;
  name?: string; // Optional descriptive name
  order: number; // For strictly validating the rendering sequence
  rootComponentId: string; // The ID registered in the global registry
}

export interface GovernanceRules {
  requiresEvidence: boolean;
  requiresHumanDecision: boolean;
  decisionAuthority: boolean;
  canRecommend: boolean;
  canExecute: boolean;
  canCreateGovernanceDecision: boolean;
}

export interface ExecutiveExperienceDefinition {
  layers: ExecutiveExperienceLayer[];
  rules: GovernanceRules;
}

export interface ProductCapabilities {
  intelligenceSources: { engine: string; context: string }[];
  confidenceModel: { 
    minimumRequired: 'LOW' | 'MODERATE' | 'HIGH' | 'ABSOLUTE';
    auditTrailVisible: boolean;
  };
}

export interface ProductMetadata {
  id: string;
  purpose: string;
  executiveDecisionSupported: string[];
}

export interface ExecutiveProductDefinition {
  metadata: ProductMetadata;
  office: ExecutiveOffice;
  productType: ExecutiveProductType;
  advisoryLevel: AdvisoryLevel;
  capabilities: ProductCapabilities;
  experience: ExecutiveExperienceDefinition;
}
