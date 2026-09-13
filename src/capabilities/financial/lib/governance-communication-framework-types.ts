import type { BoardNarrative } from './board-narrative-types';
import type { AdvisoryNarrative } from './advisory-narrative-types';
import type { PartnerNarrative } from './partner-narrative-types';
import type { ManagementNarrative } from './management-narrative-types';

export interface GovernanceCommunicationFrameworkInput {
  boardNarrative?: BoardNarrative;
  advisoryNarrative?: AdvisoryNarrative;
  partnerNarrative?: PartnerNarrative;
  managementNarrative?: ManagementNarrative;
}

export interface GovernanceCommunicationFrameworkReportLike {
  boardNarrative?: BoardNarrative;
  advisoryNarrative?: AdvisoryNarrative;
  partnerNarrative?: PartnerNarrative;
  managementNarrative?: ManagementNarrative;
}

export interface GovernanceCommunicationFramework {
  institutionalExecutiveSummary: string;
  boardCommunicationView?: BoardNarrative;
  advisoryCommunicationView?: AdvisoryNarrative;
  partnerCommunicationView?: PartnerNarrative;
  managementCommunicationView?: ManagementNarrative;
  integratedExecutiveAgenda: string[];
  integratedDecisionAgenda: string[];
  integratedAttentionPoints: string[];
  stakeholderCommunicationMatrix: {
    board: string;
    advisory: string;
    partners: string;
    management: string;
  };
  fiduciaryDisclaimer: string;
}
