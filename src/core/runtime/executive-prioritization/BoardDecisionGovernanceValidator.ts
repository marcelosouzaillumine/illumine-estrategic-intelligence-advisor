// src/core/runtime/executive-prioritization/BoardDecisionGovernanceValidator.ts

export type ExecutiveDomain =
  | 'Capital'
  | 'Estratégia'
  | 'Governança'
  | 'Risco'
  | 'Receita'
  | 'Custos'
  | 'Caixa'
  | 'Processos'
  | 'Operação';

export class BoardDecisionGovernanceValidator {
  private static readonly BOARD_DOMAINS = new Set<ExecutiveDomain>([
    'Capital',
    'Estratégia',
    'Governança',
    'Risco',
  ]);

  private static readonly DIRECTORY_DOMAINS = new Set<ExecutiveDomain>([
    'Receita',
    'Custos',
    'Caixa',
    'Processos',
    'Operação',
  ]);

  public static isBoardDomain(domain: ExecutiveDomain): boolean {
    return this.BOARD_DOMAINS.has(domain);
  }

  public static isDirectoryDomain(domain: ExecutiveDomain): boolean {
    return this.DIRECTORY_DOMAINS.has(domain);
  }

  /**
   * Filters decisions to ensure they contain only Board-level domains.
   * If any operational/directory actions leak in, they are filtered out to protect governance boundaries.
   */
  public static filterBoardDecisions<T extends { domain: ExecutiveDomain }>(decisions: T[]): T[] {
    return decisions.filter(d => this.isBoardDomain(d.domain));
  }

  /**
   * Filters actions to ensure they contain only Directory-level domains.
   */
  public static filterDirectoryActions<T extends { domain: ExecutiveDomain }>(actions: T[]): T[] {
    return actions.filter(a => this.isDirectoryDomain(a.domain));
  }
}
