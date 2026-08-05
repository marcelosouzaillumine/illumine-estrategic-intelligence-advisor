import { ExecutiveSectionSchema } from './ExecutiveSectionSchema';
import { ExecutiveOffice } from '../governance/offices/ExecutiveOffice';
import { ExecutiveProductType, AdvisoryLevel } from '../products/ExecutiveProductType';

export interface IntelligenceSource {
  engine: string;
  context: string;
}

export interface ConfidenceDefinition {
  minimumRequired: 'LOW' | 'MODERATE' | 'HIGH' | 'ABSOLUTE';
  auditTrailVisible: boolean;
}

export interface GovernanceDefinition {
  requiresEvidence: boolean;
  requiresHumanDecision: boolean;
}

export interface ExecutiveProductSchema {
  id: string;
  office: ExecutiveOffice;
  productType: ExecutiveProductType;
  advisoryLevel: AdvisoryLevel;
  decisionAuthority: boolean;
  purpose: string;
  executiveDecisionSupported: string[];
  hierarchy: ExecutiveSectionSchema[];
  intelligenceSources: IntelligenceSource[];
  confidenceModel: ConfidenceDefinition;
  governance: GovernanceDefinition;
}
