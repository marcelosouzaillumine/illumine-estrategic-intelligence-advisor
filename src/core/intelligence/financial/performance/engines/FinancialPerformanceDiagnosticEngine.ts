import { FinancialPerformanceContext } from '../context/FinancialPerformanceContext';
import { FinancialStatementContext } from '../../context/FinancialStatementContext';
import { ProfitabilityRelationshipEngine } from './ProfitabilityRelationshipEngine';
import { EarningsQualityEngine } from './EarningsQualityEngine';

export interface PerformanceDiagnosisOutput {
  diagnosis: string;
  risks: string[];
  opportunities: string[];
  signals: {
    strengths: string[];
    attentionPoints: string[];
  };
}

export class FinancialPerformanceDiagnosticEngine {
  private relEngine = new ProfitabilityRelationshipEngine();
  private qualityEngine = new EarningsQualityEngine();

  public synthesize(perfContext: FinancialPerformanceContext, fullContext: FinancialStatementContext): PerformanceDiagnosisOutput {
    const relationships = this.relEngine.evaluate(perfContext, fullContext);
    const quality = this.qualityEngine.evaluate(fullContext);

    let diagnosis = "A empresa apresenta estabilidade econômica padrão.";
    const risks: string[] = [];
    const opportunities: string[] = [];
    const strengths: string[] = [];
    const attentionPoints: string[] = [];

    // Diagnostic assembly based on engines
    if (relationships.some(r => r.type === 'VALUE_DESTRUCTION_RISK')) {
      diagnosis = "A empresa apresenta expansão comercial, porém com deterioração da eficiência operacional e redução da capacidade de conversão econômica.";
      risks.push("Compressão de margem", "Crescimento consumindo caixa");
      opportunities.push("Revisar estrutura de custos", "Avaliar rentabilidade por linha de negócio");
      attentionPoints.push("Crescimento com baixa eficiência");
    } else if (relationships.some(r => r.type === 'PROFITABLE_GROWTH')) {
      diagnosis = "A empresa apresenta crescimento consistente com forte eficiência operacional e conversão de caixa saudável.";
      strengths.push("Crescimento de receita", "Margem preservada");
      opportunities.push("Acelerar investimentos de expansão");
    }

    if (quality?.status === 'LOW_CASH_CONVERSION') {
      attentionPoints.push("Lucro sem conversão em caixa");
      risks.push("Risco de liquidez mascarado por lucro contábil");
    } else if (quality?.status === 'HIGH_QUALITY_EARNINGS') {
      strengths.push("Lucro com alta conversão de caixa");
    }

    return {
      diagnosis,
      risks,
      opportunities,
      signals: {
        strengths,
        attentionPoints
      }
    };
  }
}
