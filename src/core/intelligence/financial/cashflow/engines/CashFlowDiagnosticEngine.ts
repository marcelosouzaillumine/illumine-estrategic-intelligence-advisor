import { FinancialStatementContext } from '../../context/FinancialStatementContext';
import { FinancialPerformanceContext } from '../../performance/context/FinancialPerformanceContext';
import { CashConversionEngine } from './CashConversionEngine';
import { CashSustainabilityEngine } from './CashSustainabilityEngine';
import { InvestmentEfficiencyEngine } from './InvestmentEfficiencyEngine';
import { CashFlowRelationshipEngine } from './CashFlowRelationshipEngine';
import { CashFlowIntelligenceContext } from '../context/CashFlowIntelligenceContext';

export interface CashFlowDiagnosisOutput {
  diagnosis: string;
  cashQuality: string;
  risks: string[];
  opportunities: string[];
  strategicQuestions: string[];
  signals: {
    strengths: string[];
    attentionPoints: string[];
  };
}

export class CashFlowDiagnosticEngine {
  private convEngine = new CashConversionEngine();
  private sustEngine = new CashSustainabilityEngine();
  private invEngine = new InvestmentEfficiencyEngine();
  private relEngine = new CashFlowRelationshipEngine();

  public synthesize(
    perfContext: FinancialPerformanceContext, 
    fullContext: FinancialStatementContext,
    cashContext: CashFlowIntelligenceContext
  ): CashFlowDiagnosisOutput {
    const conversion = this.convEngine.evaluate(fullContext);
    const sustainability = this.sustEngine.evaluate(fullContext);
    const investment = this.invEngine.evaluate(fullContext, perfContext.revenueGrowth);
    const relationship = this.relEngine.evaluate(perfContext, fullContext);

    let diagnosis = "A empresa apresenta geração de caixa padrão.";
    let cashQuality = "NORMAL";
    const risks: string[] = [];
    const opportunities: string[] = [];
    const strategicQuestions: string[] = [];
    const strengths: string[] = [];
    const attentionPoints: string[] = [];

    // Synthesize based on signals
    if (conversion?.type === 'PROFIT_WITHOUT_CASH') {
      cashQuality = "LOW_QUALITY";
      attentionPoints.push("Lucro não convertido em caixa");
      risks.push("Insolvência mascarada por lucro contábil");
      strategicQuestions.push("O lucro apresentado possui qualidade financeira?");
    } else if (conversion?.type === 'HEALTHY_CONVERSION') {
      cashQuality = "HIGH_QUALITY";
      strengths.push("Alta conversão de EBITDA em caixa");
    }

    if (sustainability?.type === 'CASH_DEPENDENCY_RISK') {
      attentionPoints.push("Dependência de financiamento externo");
      risks.push("Risco de dependência de capital");
    }

    if (investment?.type === 'STRATEGIC_INVESTMENT') {
      strengths.push("Investimentos alinhados ao crescimento");
    } else if (investment?.type === 'INVESTMENT_EFFICIENCY_RISK') {
      attentionPoints.push("CAPEX sem retorno comprovado");
      strategicQuestions.push("A geração de caixa suporta os investimentos planejados?");
    }

    if (relationship?.type === 'WORKING_CAPITAL_PRESSURE') {
      diagnosis = "A empresa apresenta forte geração econômica, porém o crescimento exige monitoramento da conversão do lucro devido à pressão no capital de giro.";
      attentionPoints.push("Crescimento pressionando capital de giro");
      strategicQuestions.push("O crescimento comercial está sendo financiado pela operação ou pelo caixa acumulado?");
    }

    return {
      diagnosis,
      cashQuality,
      risks,
      opportunities,
      strategicQuestions,
      signals: {
        strengths,
        attentionPoints
      }
    };
  }
}
