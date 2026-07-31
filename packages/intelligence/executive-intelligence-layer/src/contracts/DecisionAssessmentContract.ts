/**
 * Contrato para a Avaliação Fiduciária de uma Decisão Estratégica.
 */
export interface DecisionAssessmentContract {
  /**
   * Decisão submetida à validação do motor.
   */
  proposedDecision: string;

  /**
   * Status final do julgamento da decisão.
   */
  status: 'APPROVED' | 'APPROVED_WITH_CONDITIONS' | 'BLOCKED';

  /**
   * Motivos fiduciários que justificam a aprovação condicional ou bloqueio.
   */
  reasons: string[];

  /**
   * Condicionantes operacionais, exigidas caso status seja 'APPROVED_WITH_CONDITIONS'.
   */
  conditions?: string[];

  /**
   * Se bloqueada, o motor sugere qual caminho alternativo a empresa deveria priorizar.
   */
  recommendedAlternative?: string;
}
