import { FinancialDecisionOption } from './FinancialDecisionOption';

export interface CapitalAllocationContext {
  liquidityLevel: 'High' | 'Medium' | 'Low';
  cashAvailable: number; // Percentage or absolute
  operationalRequirement: number;
  debtLevel: 'High' | 'Medium' | 'Low';
  growthOpportunity: boolean;
}

export class CapitalAllocationEngine {
  /**
   * Evaluates possible strategic destinations for available capital.
   */
  public evaluateOptions(context: CapitalAllocationContext): FinancialDecisionOption[] {
    const options: FinancialDecisionOption[] = [];

    // Excess Cash Scenario
    if (context.cashAvailable > context.operationalRequirement && context.liquidityLevel === 'High') {
      
      if (context.growthOpportunity) {
        options.push({
          id: 'opt_alloc_growth',
          title: 'Avaliar expansão operacional utilizando capital disponível',
          category: 'GROWTH',
          triggerConcepts: ['excessive_liquidity', 'growth_opportunity'],
          rationale: 'A elevada disponibilidade de caixa superior à necessidade operacional permite financiar expansão sem incorrer em custo de captação.',
          expectedImpact: {
            financial: 'Redução temporária da liquidez imediata, potencial aumento de ROIC a médio prazo.',
            operational: 'Aumento da capacidade produtiva ou comercial.',
            strategic: 'Ganho de market share sem alavancagem externa.'
          },
          risks: ['Risco de execução', 'Imobilização de capital circulante'],
          prerequisites: ['Plano de expansão estruturado', 'Análise de viabilidade comercial'],
          confidence: 0.88,
          governance: {
            requiresHumanApproval: true,
            evidence: ['Liquidez corrente > benchmark', 'Caixa excedente'],
            confidence: 0.88,
            limitations: ['Não considera macroeconomia externa'],
            originFact: 'Cash Available > Operational Requirement'
          }
        });
      }

      if (context.debtLevel === 'High') {
        options.push({
          id: 'opt_alloc_debt',
          title: 'Avaliar antecipação ou amortização de dívida estrutural',
          category: 'DEBT_MANAGEMENT',
          triggerConcepts: ['excessive_liquidity', 'high_leverage'],
          rationale: 'Utilização do caixa excedente para reduzir custo financeiro e melhorar a estrutura de capital.',
          expectedImpact: {
            financial: 'Redução da despesa financeira, melhora na margem líquida.',
            operational: 'Nenhum impacto operacional direto.',
            strategic: 'Redução do risco de solvência.'
          },
          risks: ['Descapitalização diante de imprevistos', 'Penalidades por liquidação antecipada'],
          prerequisites: ['Análise do custo da dívida vs. rendimento do caixa'],
          confidence: 0.92,
          governance: {
            requiresHumanApproval: true,
            evidence: ['Alta liquidez', 'Alto endividamento'],
            confidence: 0.92,
            limitations: ['Depende das cláusulas dos contratos de dívida']
          }
        });
      }

      // Default option for excessive cash
      options.push({
        id: 'opt_alloc_efficiency',
        title: 'Reavaliar eficiência do capital empregado',
        category: 'CAPITAL_ALLOCATION',
        triggerConcepts: ['excessive_liquidity'],
        rationale: 'Manter caixa excessivo sem destinação estratégica dilui a rentabilidade do patrimônio líquido.',
        expectedImpact: {
          financial: 'Possível melhora no ROE via distribuição de dividendos ou readequação de aplicações.',
          operational: 'Nenhum.',
          strategic: 'Otimização da estrutura de capital.'
        },
        risks: ['Distribuição excessiva gerando falta de capital de giro futuro'],
        prerequisites: ['Previsão de fluxo de caixa de 12 meses'],
        confidence: 0.85,
        governance: {
          requiresHumanApproval: true,
          evidence: ['Liquidez excedente identificada no diagnóstico'],
          confidence: 0.85,
          limitations: []
        }
      });
    }

    return options;
  }
}
