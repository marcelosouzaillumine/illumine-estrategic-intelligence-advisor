export type ExecutivePersona = 'CEO' | 'CFO' | 'DIRECTOR' | 'ADVISOR' | 'BOARD_MEMBER' | 'INVESTOR' | 'UNKNOWN';
export type OperationalRole = 'CLIENT' | 'ADVISOR' | 'ADMIN' | 'UNKNOWN';
export type JourneyStage = 'ONBOARDING' | 'ACTIVE' | 'CRISIS' | 'REVIEW' | 'IDLE';
export type InteractionMode = 'SILENT' | 'PROACTIVE' | 'RESPONSIVE' | 'CRITICAL_ALERT';

/**
 * Value Object central: "Memória Viva" do relacionamento.
 * O ERI usa isso para entender QUEM está navegando e COMO.
 */
export interface ExecutiveRelationshipState {
  userIdentity: string;
  operationalRole: OperationalRole;
  executivePersona: ExecutivePersona;
  companyContext: string;
  lastAccess: string;
  lastInteraction: string;
  journeyStage: JourneyStage;
  activeRecommendations: number;
  unresolvedItems: number;
  relevantChanges: number;
  communicationPreference: string;
  interactionMode: InteractionMode;
}
