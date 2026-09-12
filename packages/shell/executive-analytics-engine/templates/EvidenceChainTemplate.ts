import { ExecutiveAnalyticsEvidence } from '../types/evidence';
import { DomainContextTemplate } from './CapabilityTemplate';

/**
 * Template para geração da Cadeia de Custódia Analítica (Evidence Chain).
 * Centraliza a injeção dos metadados de rastreabilidade (Trust Gate) de todas as Capabilities.
 */
export class EvidenceChainTemplate {
  /**
   * Gera o objeto padrão de evidência exigido pelo `ExecutiveAnalyticsResult`.
   */
  public static generate(context: DomainContextTemplate): ExecutiveAnalyticsEvidence {
    return {
      evidenceId: `EVD-TEMPLATE-${Date.now()}`,
      period: context.period || 'CURRENT',
      tenantId: context.tenantId || 'UNKNOWN',
      workspaceId: context.snapshotId || 'NO-WORKSPACE',
      certifiedAt: new Date().toISOString(),
      
      // As fontes de dados que serviram de base para o cálculo (Ex: ERP, Excel, Mock, BD)
      dataSources: [
        {
          sourceName: 'TemplateSource',
          reliability: 1, // 0 a 1
          lastSync: new Date().toISOString()
        }
      ],

      // O payload bruto extraído da fonte
      rawValues: {
        rawSnapshot: true // context.domainData
      },

      // Fórmulas exatas aplicadas durante aCapability
      formulasApplied: [
        {
          name: 'TemplateFormula',
          expression: 'A / B',
          result: 0
        }
      ],

      // Sub-indicadores invocados
      indicatorsUsed: ['IndicatorA', 'IndicatorB'],

      // Parecer puramente técnico gerado a partir do cálculo
      technicalConclusion: 'Conclusão analítica de sistema baseada na evidência.'
    };
  }
}
