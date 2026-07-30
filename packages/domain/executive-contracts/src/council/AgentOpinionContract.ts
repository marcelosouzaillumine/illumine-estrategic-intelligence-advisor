export type AgentRole = 'CFO' | 'COO' | 'CRO' | 'CCO' | 'CEO';

export interface AgentOpinionContract {
  readonly agentRole: AgentRole;
  readonly perspectiveName: string; // ex: 'Liquidez & Retorno Financeiro'
  readonly diagnosis: string;
  readonly proposedAction: string;
  readonly confidenceScore: number;
  readonly supportingEvidence: readonly string[];
  readonly votedDecision: 'APPROVE' | 'APPROVE_WITH_RESERVATIONS' | 'REJECT';
}
