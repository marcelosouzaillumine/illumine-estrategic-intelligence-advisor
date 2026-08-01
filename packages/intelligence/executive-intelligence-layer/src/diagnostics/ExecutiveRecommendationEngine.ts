import { ExecutiveDiagnosis } from '../contracts/ExecutiveDiagnosis';
import { ExecutiveRecommendation } from '../contracts/ExecutiveRecommendation';

export class ExecutiveRecommendationEngine {
  /**
   * Gera recomendações determinísticas estritamente baseadas no Diagnóstico Executivo.
   */
  public static generate(diagnosis: ExecutiveDiagnosis): ExecutiveRecommendation[] {
    const recommendations: ExecutiveRecommendation[] = [];

    if (diagnosis.financialState.status === 'CRITICAL') {
      recommendations.push({
        id: `REC-${Date.now()}-1`,
        action: 'Preservação extrema de liquidez operando em retenção integral de lucro',
        priority: 'CRITICAL',
        owner: 'Board / CFO',
        deadline: 'Imediato',
        status: 'PENDING',
        rationale: 'Preservação de liquidez forçada devido à falha na estrutura de capital.'
      });
      recommendations.push({
        id: `REC-${Date.now()}-2`,
        action: 'Renegociação de passivos de curto prazo (Alongamento de dívida)',
        priority: 'HIGH',
        owner: 'Tesouraria',
        deadline: '30 dias',
        status: 'PENDING',
        rationale: 'Necessidade urgente de alívio no fluxo de caixa.'
      });
    } else if (diagnosis.financialState.status === 'STRESSED') {
      recommendations.push({
        id: `REC-${Date.now()}-1`,
        action: 'Revisão do ciclo de caixa e política de recebimentos',
        priority: 'HIGH',
        owner: 'Diretoria Financeira',
        deadline: '45 dias',
        status: 'PENDING',
        rationale: 'Otimização do capital de giro para estabilizar a operação.'
      });
    } else if (diagnosis.financialState.status === 'HEALTHY') {
      recommendations.push({
        id: `REC-${Date.now()}-1`,
        action: 'Aprovação de investimentos para aceleração de crescimento',
        priority: 'MEDIUM',
        owner: 'CEO',
        deadline: 'Trimestre atual',
        status: 'PENDING',
        rationale: 'Fundamentos financeiros consolidados suportam expansão.'
      });
    }

    return recommendations;
  }
}
