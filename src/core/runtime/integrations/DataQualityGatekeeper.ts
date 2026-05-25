import { DataQualityViolation } from './IntegrationGovernanceTypes';

export class DataQualityGatekeeper {
  /**
   * Inspeciona estruturalmente o payload de entrada. 
   * Não altera, apenas sinaliza ou bloqueia.
   */
  static inspect(payload: any, tenantId: string, workspaceId: string): DataQualityViolation[] {
    const violations: DataQualityViolation[] = [];

    if (!payload || Object.keys(payload).length === 0) {
      violations.push({
        violationId: `VQ-${Date.now()}-1`,
        rule: 'EMPTY_DATASET',
        severity: 'BLOCKER',
        message: 'Dataset vazio ou não reconhecido.'
      });
      return violations;
    }

    if (payload._tenantId && payload._tenantId !== tenantId) {
      violations.push({
        violationId: `VQ-${Date.now()}-2`,
        rule: 'CROSS_TENANT_LEAKAGE',
        severity: 'BLOCKER',
        message: `Dataset aponta para o tenant ${payload._tenantId}, diferente do ativo (${tenantId}).`
      });
    }

    if (payload.simulateMissingColumn) {
      violations.push({
        violationId: `VQ-${Date.now()}-3`,
        rule: 'MISSING_MANDATORY_FIELD',
        severity: 'WARNING',
        message: 'A coluna obrigatória "Valor Bruto" está ausente. Mapeamento manual requerido.',
        field: 'Valor Bruto'
      });
    }

    return violations;
  }
}
