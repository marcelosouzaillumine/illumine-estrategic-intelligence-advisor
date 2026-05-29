import { InstitutionalBusinessProfile } from "../institutional-identity/InstitutionalBusinessProfile";
import { 
  SegmentIntelligenceProfile, 
  DownstreamRuntimeRestrictions,
  SegmentIntelligenceAuditEntry
} from "../institutional-context/SegmentIntelligenceTypes";

export type ConclusionPermissionLevel = 
  | "FULL_ALLOWED"
  | "ALLOWED_WITH_DISCLOSURE"
  | "RESTRICTED"
  | "BLOCKED";

export interface RequiredContextBeforeExecution {
  segmentValidated: boolean;
  operatingModelValidated: boolean;
  capitalCycleValidated: boolean;
  historicalDensityValidated: boolean;
  restrictionsMapped: boolean;
}

export interface BlockedConclusion {
  conclusionType: string;
  deterministicTrigger: string;
  limitationCreated: string;
  sourceRule: string;
}

export interface AllowedConclusion {
  conclusionType: string;
  permissionLevel: ConclusionPermissionLevel;
  disclosureRequired?: string;
  warning?: string;
}

export interface FinancialRuntimeContext {
  institutionalBusinessProfile: InstitutionalBusinessProfile;
  segmentIntelligenceProfile: SegmentIntelligenceProfile;
  requiredContextBeforeExecution: RequiredContextBeforeExecution;
  allowedConclusions: AllowedConclusion[];
  blockedConclusions: BlockedConclusion[];
  interpretationWarnings: string[];
  requiredDisclosures: string[];
  contextualConfidence: "HIGH" | "MODERATE" | "LOW" | "RESTRICTED";
  auditTrail: SegmentIntelligenceAuditEntry[];
  runtimeGuards: {
    passedPropagationIntegrityCheck: boolean;
    failClosedTriggered: boolean;
  };
}
