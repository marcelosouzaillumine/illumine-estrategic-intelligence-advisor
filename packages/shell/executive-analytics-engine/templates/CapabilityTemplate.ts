import { ExecutiveAnalyticsResult } from '../index';
import { CapabilityResult } from '../capabilities/BaseCapability';
import { EvidenceChainTemplate } from './EvidenceChainTemplate';

/**
 * Interface obrigatória para Governança do Ciclo de Vida da Capability.
 */
export interface AnalyticsCapabilityMetadata {
  capabilityId: string;
  domain: string;
  owner: string;
  version: string;
  certificationStatus: 'draft' | 'validated' | 'certified';
}

/**
 * Contexto base que a Capability receberá da camada de View / Controller.
 * O contexto varia por Domínio Analítico.
 */
export interface DomainContextTemplate {
  tenantId: string;
  period: string;
  snapshotId: string;
  // domainData: any; // Substituir pela tipagem correta de entrada dos dados do domínio
}

/**
 * Template Canônico para construção de Capabilities de Domínio.
 * Nenhuma inteligência de visualização ou geração de narrativa deve estar presente aqui.
 * Apenas os cálculos técnicos e os diagnósticos padronizados baseados na Evidence Chain.
 */
export class CapabilityTemplate {
  public static metadata: AnalyticsCapabilityMetadata = {
    capabilityId: 'CAP-TEMPLATE-001',
    domain: 'TemplateDomain',
    owner: 'Architecture Review Board',
    version: '1.0.0',
    certificationStatus: 'draft'
  };

  /**
   * Avalia os dados do contexto e retorna o resultado estruturado.
   */
  public evaluate(context: DomainContextTemplate): ExecutiveAnalyticsResult {
    const diagnostics: CapabilityResult[] = [];
    const metrics: any[] = [];
    const indicators: any[] = [];
    
    // 1. Definição da Cadeia de Custódia (Evidence Chain)
    const evidence = EvidenceChainTemplate.generate(context);

    // 2. Cálculo dos Indicadores usando motores de cálculo puros (Financial Calculation Engine, etc)
    // const coreIndicator = SomeCalculationEngine.calculate(context.domainData);
    
    // 3. Geração dos Diagnósticos (Status)
    /*
    diagnostics.push({
      capability: 'MetricName',
      score: 85,
      status: 'HEALTHY',
      technicalConclusion: 'Conclusão puramente técnica, sem interpretações estratégicas abertas.',
      evidence: evidence
    });
    */

    return {
      diagnostics,
      metrics,
      indicators,
      confidence: 1, // 0 a 1
      warnings: [],
      recommendations: [],
      forensics: {},
      governance: {
        lastAudited: new Date().toISOString(),
        auditorNode: 'CapabilityTemplate'
      },
      evidence
    };
  }
}
