import { DiagnosticDomain, MaturityLevel } from '../diagnostics/core/diagnostic-types';
import { OrganizationalStage } from '../executive-profile/portfolio-summary.service';

export interface IntelligenceDomainState {
  domain: DiagnosticDomain;
  maturityLevel?: MaturityLevel;
  currentCapability: string;
  strategicRole:
    | "foundation"
    | "growth"
    | "scale"
    | "transformation";
  status:
    | "established"
    | "developing"
    | "future";
}

export interface ExecutivePriority {
  id: string;
  title: string;
  description: string;
  domain: DiagnosticDomain;
}

export interface EvolutionPath {
  nextDomain: DiagnosticDomain;
  reason: string;
}

export interface ExecutiveOperatingModel {
  organizationStage: OrganizationalStage;
  currentExecutiveReality: string;
  intelligenceDomains: IntelligenceDomainState[];
  executivePriorities: ExecutivePriority[];
  strategicConversation: string;
  evolutionPath: EvolutionPath[];
}
