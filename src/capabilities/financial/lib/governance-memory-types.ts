import type { BoardNarrative } from "./board-narrative-types";
import type { AdvisoryNarrative } from "./advisory-narrative-types";
import type { PartnerNarrative } from "./partner-narrative-types";
import type { ManagementNarrative } from "./management-narrative-types";
import type { GovernanceCommunicationFramework } from "./governance-communication-framework-types";
import type { InstitutionalReportPackage } from "./institutional-reporting-types";

export type GovernanceMemoryEventType =
  | "BOARD_DECISION"
  | "ACTION_PLAN_CREATED"
  | "ACTION_PLAN_COMPLETED"
  | "RISK_ESCALATED"
  | "RISK_CLOSED"
  | "STRATEGIC_RECOMMENDATION"
  | "POLICY_APPROVED"
  | "POLICY_REVISED";

export interface GovernanceMemoryEvent {
  eventId: string;
  timestamp: string;
  eventType: GovernanceMemoryEventType;
  title: string;
  description: string;
  sourceLayer:
    | "BNL"
    | "ANL"
    | "PNL"
    | "MNL"
    | "GCF"
    | "BPG"
    | "IRF";
  relatedTopics: string[];
  relatedRisks: string[];
  relatedDecisions: string[];
}

export interface GovernanceMemoryInput {
  boardNarrative?: BoardNarrative;
  advisoryNarrative?: AdvisoryNarrative;
  partnerNarrative?: PartnerNarrative;
  managementNarrative?: ManagementNarrative;
  governanceCommunicationFramework?: GovernanceCommunicationFramework;
  institutionalReportPackage?: InstitutionalReportPackage;
}

export interface GovernanceMemoryReportLike {
  boardNarrative?: BoardNarrative;
  advisoryNarrative?: AdvisoryNarrative;
  partnerNarrative?: PartnerNarrative;
  managementNarrative?: ManagementNarrative;
  governanceCommunicationFramework?: GovernanceCommunicationFramework;
  institutionalReportPackage?: InstitutionalReportPackage;
}

export interface GovernanceMemory {
  events: GovernanceMemoryEvent[];
  recurringTopics: string[];
  recurringRisks: string[];
  openActionItems: string[];
  completedActionItems: string[];
  institutionalLearnings: string[];
}
