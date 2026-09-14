import type { BoardNarrative } from './board-narrative-types';
import type { AdvisoryNarrative } from './advisory-narrative-types';
import type { PartnerNarrative } from './partner-narrative-types';
import type { ManagementNarrative } from './management-narrative-types';
import type { GovernanceCommunicationFramework } from './governance-communication-framework-types';
import type { UnifiedFinancialNarrative } from './unified-financial-narrative-types';

export interface BoardPackInput {
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
  boardNarrative?: BoardNarrative;
  advisoryNarrative?: AdvisoryNarrative;
  partnerNarrative?: PartnerNarrative;
  managementNarrative?: ManagementNarrative;
  governanceCommunicationFramework?: GovernanceCommunicationFramework;
}

export interface BoardPackReportLike {
  unifiedFinancialNarrative?: UnifiedFinancialNarrative;
  boardNarrative?: BoardNarrative;
  advisoryNarrative?: AdvisoryNarrative;
  partnerNarrative?: PartnerNarrative;
  managementNarrative?: ManagementNarrative;
  governanceCommunicationFramework?: GovernanceCommunicationFramework;
}

export interface BoardPack {
  executiveCover: string;
  institutionalSummary: string;
  executiveAgenda: string[];
  fiduciaryQuestions: string[];
  decisionPoints: string[];
  strategicRisks: string[];
  recommendedActions: string[];
  boardMessage: string;
  advisoryPerspective?: string;
  partnerPerspective?: string;
  managementPerspective?: string;
  governanceCommunicationSummary: string;
  fiduciaryDisclaimer: string;
}
