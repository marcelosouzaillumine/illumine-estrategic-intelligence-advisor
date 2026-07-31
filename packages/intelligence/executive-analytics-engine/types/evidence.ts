/**
 * Evidence Chain™
 * 
 * Estrutura tipada que garante rastreabilidade profunda para qualquer conclusão
 * gerada pelo Executive Analytics Engine, servindo de base para auditoria (Trust Gate).
 */

export interface ExecutiveAnalyticsEvidence {
  /** 
   * Identificador único da cadeia de evidência.
   */
  evidenceId: string;
  
  /**
   * O período de tempo ao qual a análise se refere (ex: '2026-Q1', '2025').
   */
  period: string;

  /**
   * O identificador do Tenant (empresa) sendo analisado.
   */
  tenantId: string;

  /**
   * O identificador do workspace organizacional sendo analisado.
   */
  workspaceId: string;

  /**
   * A origem do dado (ex: 'IntegrationEngine', 'ManualEntry', 'ERP-Connector').
   */
  dataSource: string;

  /**
   * Identificador do snapshot de dados congelado usado para esta análise.
   */
  dataSnapshotId: string;

  /**
   * A versão do Executive Analytics Engine que gerou esta conclusão.
   */
  engineVersion: string;

  /**
   * Timestamp da certificação da evidência.
   */
  certifiedAt: string;

  /**
   * Detalhamento dos valores brutos que fundamentaram a análise.
   */
  rawValues: Array<{
    field: string;
    value: number | string;
    currency?: string;
  }>;

  /**
   * Detalhamento das fórmulas ou métricas compostas (ex: Liquidez = Ativo / Passivo).
   */
  formulasApplied: Array<{
    name: string;
    expression: string;
    result: number;
  }>;

  /**
   * Lista de indicadores certificados utilizados nesta evidência.
   */
  indicatorsUsed: Array<{
    indicatorId: string;
    value: number;
    benchmarkComparison?: 'ABOVE' | 'BELOW' | 'ON_TARGET';
  }>;

  /**
   * Conclusão técnica puramente matemática extraída (ex: "Liquidez Corrente = 2.31").
   */
  technicalConclusion: string;

  /**
   * Hash de validação criptográfica (opcional, gerado pelo Trust Gate).
   */
  integrityHash?: string;
}
