import { DiagnosticDomain } from '../diagnostics/core/diagnostic-types';
import { ExecutiveProfilePortfolio } from './portfolio-types';
import { OrganizationalStage } from './portfolio-summary.service';
import { MaturityLevel } from '../diagnostics/core/diagnostic-types';

export interface MaturityEvolution {
  domain: DiagnosticDomain;
  previousLevel?: MaturityLevel;
  currentLevel: MaturityLevel;
  evolutionDirection: "improving" | "stable" | "attention";
}

export interface ExecutiveAdvisoryContext {
  id: string; // The active context ID
  profileId: string; // Legacy bridge
  domain: string; // Legacy bridge
  organizationStage: OrganizationalStage;
  currentExecutiveReality: string;
  strategicConversation: string;
  intelligencePortfolio: ExecutiveProfilePortfolio;
  completedJourneys: DiagnosticDomain[];
  maturityEvolution: MaturityEvolution[];
  recommendedConversation: {
    topic: string;
    objective: string;
  };
  generatedAt: string;
  // Legacy properties for backward compatibility with older components
  currentChallenge?: string;
  suggestedFocus?: string[];
  advisoryPriority?: string;
  profile?: any;
}
