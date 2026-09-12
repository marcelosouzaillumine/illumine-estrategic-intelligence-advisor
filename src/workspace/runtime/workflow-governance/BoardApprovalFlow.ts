import { DecisionWorkflowEngine } from './DecisionWorkflowEngine';
import { WorkflowActor, DecisionLineageReference } from './WorkflowGovernanceTypes';

export class BoardApprovalFlow {
  /**
   * Inicia o fluxo estrito de aprovação do conselho sobre relatórios consolidados.
   */
  static initiateBoardPackApproval(
    lineage: DecisionLineageReference,
    creator: WorkflowActor
  ) {
    return DecisionWorkflowEngine.createWorkflow(
      'BOARD_PACK_APPROVAL',
      `Aprovação de Relatório Executivo - ${lineage.reportVersion || 'N/A'}`,
      'Requer assinatura digital formal dos membros do Board para selo institucional.',
      lineage,
      creator
    );
  }
}
