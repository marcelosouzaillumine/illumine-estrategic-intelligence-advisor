import { DecisionWorkflowEngine } from './DecisionWorkflowEngine';
import { WorkflowActor, DecisionLineageReference } from './WorkflowGovernanceTypes';

export class AlertResponseWorkflow {
  /**
   * Transforma um alerta grave em um Workflow de Responsabilização sem alterar o Alerta original.
   */
  static initiateFromAlert(
    alertId: string,
    alertMessage: string,
    lineage: DecisionLineageReference,
    creator: WorkflowActor
  ) {
    return DecisionWorkflowEngine.createWorkflow(
      'ALERT_RESPONSE',
      `Resposta a Alerta Institucional`,
      `Resolução governada para o alerta: ${alertMessage}.`,
      { ...lineage, alertId }, // Embutindo a ref do alerta
      creator
    );
  }
}
