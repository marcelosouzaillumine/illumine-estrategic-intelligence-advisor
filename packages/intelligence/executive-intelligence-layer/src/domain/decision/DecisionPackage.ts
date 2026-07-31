export interface DecisionPackage {
  /**
   * A ação estratégica que foi sugerida/debatida.
   */
  decisionRequested: string;

  /**
   * Status retornado pelo Governance Engine (APPROVED, APPROVED_WITH_CONDITIONS, BLOCKED).
   */
  status: string;

  /**
   * Qual o nível de alçada exigido para aprovação desta decisão.
   */
  approvalLevel: string;

  /**
   * Regras inegociáveis que impediram a decisão, se houver.
   */
  blockingRules?: string[];

  /**
   * Caminhos alternativos se a decisão for bloqueada.
   */
  alternativeDecisions?: string[];

  /**
   * Condicionantes para liberar a decisão (ex: "Fazer hedge").
   */
  conditions?: string[];

  /**
   * KPI que provará se a decisão deu certo ou errado.
   */
  expectedKPI?: string;

  /**
   * Responsável corporativo pela execução.
   */
  owner?: string;

  /**
   * Prazo final para materialização da decisão.
   */
  deadline?: string;

  /**
   * Data programada para revisão da decisão (Learning Loop trigger).
   */
  reviewDate?: string;
}
