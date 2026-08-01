import { IntegrityBlocker } from '../FinancialIntegrityResult';
import { EarningsQualityIntelligence } from '../../contracts/FinancialIntelligenceAssessment';

export class DreIntelligenceValidator {
  /**
   * Rule Group 3 — DRE e Earnings Quality
   * Valida integridade do DRE e gera o Earnings Quality Score™
   */
  public static validate(
    financialData: any,
    historicalData?: any[]
  ): { blockers: IntegrityBlocker[], earningsQuality: EarningsQualityIntelligence } {
    
    const blockers: IntegrityBlocker[] = [];
    const drivers: string[] = [];
    
    // Safety Fallbacks
    const ebitda = financialData.ebitda || 0;
    const netIncome = financialData.netIncome || 0;
    const revenue = financialData.revenue || 0;
    const operatingCashFlow = financialData.operatingCashFlow || 0;
    const equity = financialData.equity || 0;
    const extraordinaryEvents = financialData.extraordinaryEvents || 0;

    let score = 100;
    
    // 30% Conversão EBITDA -> Caixa
    if (ebitda > 0) {
      const conversion = operatingCashFlow / ebitda;
      if (conversion < 0.3) {
        score -= 30;
        drivers.push('Baixa conversão de caixa (pressão sobre capital de giro)');
      } else if (conversion >= 0.7) {
        drivers.push('Forte geração e conversão de caixa operacional');
      } else {
        score -= 10;
        drivers.push('Conversão de caixa mediana');
      }
    } else {
      score -= 30;
      drivers.push('EBITDA negativo ou nulo, inviabilizando conversão de caixa');
    }

    // 25% Crescimento sustentável de receita (se houver histórico)
    if (historicalData && historicalData.length > 0) {
      const pastRevenue = historicalData[0].revenue || 0;
      if (pastRevenue > 0) {
        const revGrowth = (revenue - pastRevenue) / pastRevenue;
        if (revGrowth < 0) {
          score -= 25;
          
          // Verifica a Margem: Profitability Quality (Margem melhorou com receita caindo?)
          const currentMargin = revenue > 0 ? ebitda / revenue : 0;
          const pastMargin = pastRevenue > 0 ? (historicalData[0].ebitda || 0) / pastRevenue : 0;
          
          if (currentMargin > pastMargin) {
            drivers.push('Melhora de margem associada à contração operacional (redução agressiva de despesas/receitas)');
          } else {
            drivers.push('Queda de receita e margem');
          }
        } else {
          drivers.push('Crescimento de receita sustentável');
        }
      }
    } else {
      // Sem histórico não podemos pontuar negativamente, mas assumimos neutro ou aplicamos um pênalti leve?
      score -= 5; 
      drivers.push('Sem histórico suficiente para atestar sustentabilidade de crescimento');
    }

    // 20% Margem operacional recorrente
    const margin = revenue > 0 ? ebitda / revenue : 0;
    if (margin < 0.05) {
      score -= 20;
      drivers.push('Margem operacional recorrente frágil ou perigosa (< 5%)');
    } else if (margin > 0.15) {
      drivers.push('Boa margem operacional');
    }

    // 15% Dependência de eventos extraordinários
    if (Math.abs(extraordinaryEvents) > (Math.abs(netIncome) * 0.5)) {
      score -= 15;
      drivers.push('Lucratividade altamente dependente de eventos extraordinários');
    }

    // 10% Evolução patrimonial
    if (historicalData && historicalData.length > 0) {
      const pastEquity = historicalData[0].equity || 0;
      if (equity < pastEquity) {
        score -= 10;
        drivers.push('Erosão patrimonial (PL encolhendo)');
      }
    }
    
    // Classificação
    let classification: 'LOW' | 'MODERATE' | 'HIGH' = 'HIGH';
    if (score < 50) classification = 'LOW';
    else if (score < 80) classification = 'MODERATE';
    
    return {
      blockers,
      earningsQuality: {
        score: Math.max(0, score),
        classification,
        drivers
      }
    };
  }
}
