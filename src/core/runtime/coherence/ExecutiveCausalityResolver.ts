import { STRATEGIC_ACTION_DOMAIN } from '../integrity/ActionEvidenceResolver';

export interface StrategicCausality {
  domain: STRATEGIC_ACTION_DOMAIN;
  kpi: string;
  expectedImpact: string;
  executionRisk: string;
}

export class ExecutiveCausalityResolver {
  /**
   * Fornece a causalidade estratégica transversal para cada domínio.
   * O KPI e o impacto são definidos aqui (causalidade pura),
   * enquanto os thresholds operacionais são definidos no SegmentThresholdEngine (sensibilidade).
   */
  public static resolve(domain: STRATEGIC_ACTION_DOMAIN): StrategicCausality {
    switch (domain) {
      case 'UNIT_ECONOMICS':
        return {
          domain,
          kpi: 'Margem Bruta / Margem de Contribuição',
          expectedImpact: 'Melhoria da rentabilidade operacional e maior eficiência na conversão de receita em margem.',
          executionRisk: 'Crescimento operacional sem geração proporcional de resultado econômico (Erosão de Margem).'
        };
      case 'OPERATIONAL_EFFICIENCY':
        return {
          domain,
          kpi: 'Despesas Operacionais / Receita Líquida',
          expectedImpact: 'Maior previsibilidade operacional e redução da pressão sobre geração de caixa.',
          executionRisk: 'Persistência de consumo operacional de caixa e dificuldade de sustentabilidade financeira.'
        };
      case 'LIQUIDITY_PRESERVATION':
        return {
          domain,
          kpi: 'Liquidez Corrente e Ciclo de Caixa',
          expectedImpact: 'Fortalecimento da capacidade de resposta financeira de ciclo imediato.',
          executionRisk: 'Elevação da exposição a pressões de liquidez e necessidade emergencial de capital de giro.'
        };
      case 'CAPITAL_STRUCTURE':
        return {
          domain,
          kpi: 'Nível de Endividamento / Passivo Oneroso',
          expectedImpact: 'Reequilíbrio do custo de capital e redução da pressão financeira sobre os resultados.',
          executionRisk: 'Desequilíbrio na estrutura de capital, limitando flexibilidade de investimento e operação.'
        };
      case 'CORPORATE_GOVERNANCE':
        return {
          domain,
          kpi: 'Nível de Governança e Compliance Estrutural',
          expectedImpact: 'Profissionalização da gestão de capital e redução de dependência de avales restritos.',
          executionRisk: 'Vazamento de valor, conflitos de interesse ou restrição de acesso a linhas de crédito saudáveis.'
        };
      case 'UNDEFINED':
      default:
        return {
          domain: 'UNDEFINED',
          kpi: 'Alinhamento Estratégico',
          expectedImpact: 'Estabilização geral dos vetores de crescimento sustentável.',
          executionRisk: 'Desvio de foco e desperdício de eficiência.'
        };
    }
  }
}
