/**
 * Severidade de um bloqueio de integridade
 */
export type IntegritySeverity = 'WARNING' | 'CRITICAL';

/**
 * Categoria estrutural da violação
 */
export type IntegrityCategory = 'STRUCTURAL' | 'ECONOMIC' | 'TEMPORAL' | 'DECISIONAL';

/**
 * Detalhe de um ofensor de integridade
 */
export interface IntegrityBlocker {
  severity: IntegritySeverity;
  category: IntegrityCategory;
  rule: string;
  message: string;
}

/**
 * Resultado completo da auditoria do Layer 0 (Financial Integrity Engine)
 */
export interface FinancialIntegrityResult {
  /**
   * Score geral de integridade (0 a 100)
   */
  score: number;

  /**
   * Status agregado da integridade dos dados fornecidos
   */
  status: 'PASSED' | 'WARNING' | 'BLOCKED';

  /**
   * Lista de violações detectadas (se houver)
   */
  blockers: IntegrityBlocker[];

  /**
   * Ações permitidas para este nível de integridade (ex: ['VIEW_METRICS'], sem ['GENERATE_NARRATIVE'])
   */
  allowedActions: string[];
}
