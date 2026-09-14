import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { PatrimonialScoreBreakdown } from './PatrimonialScoreExplainabilityEngine';
import { ExecutiveAnalysisContext } from '../../../../core/runtime/executive-consolidation';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../../../../core/runtime/executive-consolidation';

export interface PatrimonialInterpretationOutput {
  patrimonialThesis: string;
  dominantRiskFamily: string;
  strategicSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MONITORING';
  strategicSeverityReason: string;
  overallDisclaimer: string | null;
  rationale: string;
  confidence: number;
  lineageHash: string;
  sourceRuntime: string;
}

export class PatrimonialExecutiveInterpretationEngine {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  public static generateInterpretations(
    indicators: PatrimonialIndicator[],
    breakdown: PatrimonialScoreBreakdown,
    context: ExecutiveAnalysisContext,
    ceilingApplied?: boolean,
    hasValidatedCashFlowEvidence: boolean = false,
    isOperationalCashFlowPositive: boolean = false
  ): PatrimonialInterpretationOutput {
    
    // Extracted values for evaluation
    const score = breakdown.globalScore ?? 0;
    const liqReal = indicators.find(i => i.metricName === 'Liquidez Real')?.value as number | 'INSUFFICIENT_DATA';
    const liqSeca = indicators.find(i => i.metricName === 'Liquidez Seca')?.value as number | 'INSUFFICIENT_DATA';
    const lossAbsorption = indicators.find(i => i.metricName === 'Loss Absorption Capacity')?.value as number | 'INSUFFICIENT_DATA';
    const endivGeral = indicators.find(i => i.metricName === 'Endividamento Geral')?.value as number | 'INSUFFICIENT_DATA';
    const compEndiv = indicators.find(i => i.metricName === 'Composição do Endividamento')?.value as number | 'INSUFFICIENT_DATA';
    const equityQuality = indicators.find(i => i.metricName === 'Equity Quality Index')?.classification || '';
    const estoqueConc = indicators.find(i => i.metricName === 'Ativo - Estoques %')?.value as number | 'INSUFFICIENT_DATA';
    const debtCapacity = indicators.find(i => i.metricName === 'Debt Capacity Score')?.value as number | 'INSUFFICIENT_DATA';
    const fundingCapacityVal = indicators.find(i => i.metricName === 'Funding Capacity Ratio')?.value as number | 'INSUFFICIENT_DATA';

    // Obter label técnico original (fallback para o Primary Motive Engine analisar)
    let rawTechnicalDriverLabel = 'Sem vulnerabilidades críticas identificadas';

    if (typeof liqReal === 'number' && liqReal < 0.50) {
      rawTechnicalDriverLabel = `Liquidez Real Crítica (${liqReal.toFixed(2)})`;
    } else if (typeof debtCapacity === 'number' && debtCapacity < 50) {
      rawTechnicalDriverLabel = `Debt Capacity Reduzido (${debtCapacity})`;
    } else if (typeof fundingCapacityVal === 'number' && fundingCapacityVal < 60) {
      rawTechnicalDriverLabel = `Funding Capacity Limitado (${fundingCapacityVal})`;
    } else if (score < 50) {
      rawTechnicalDriverLabel = 'Múltiplos indicadores em alerta (Score Vulnerável)';
    }

    // Call Central ExecutivePrimaryMotiveConsistencyEngine
    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(context, rawTechnicalDriverLabel);
    const strategicSeverityReason = motive.label;
    
    // Map Central Severity back to legacy string format used internally by this class
    let strategicSeverity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'MONITORING' = 'MONITORING';
    if (motive.severity === 'CRITICAL') {
      strategicSeverity = 'CRITICAL';
    } else if (motive.severity === 'WARNING') {
      strategicSeverity = 'MODERATE';
    } else {
      strategicSeverity = 'MONITORING';
    }

    // 1. Tese Patrimonial Hierárquica (Continuidade > Liquidez > Solvência > Preservação > Estrutura > Score)
    let patrimonialThesis = '';
    
    const isLRFragil = typeof liqReal === 'number' && liqReal < 0.75;
    const isLSCritica = typeof liqSeca === 'number' && liqSeca < 1.0;
    const isEndivAlto = typeof endivGeral === 'number' && endivGeral > 0.8;
    const isConsumoCap = equityQuality === 'Consumo de Capital' || equityQuality === 'Erosão Patrimonial';

    const narrativeContext = ExecutivePrimaryMotiveConsistencyEngine.deriveNarrativeContext(context, motive.severity);
    const stage = narrativeContext.strategicStage;

    if (isLRFragil || isLSCritica || isConsumoCap) {
      const issues: string[] = [];
      if (isLRFragil || isLSCritica) issues.push('fragilidade crítica de liquidez');
      if (typeof estoqueConc === 'number' && estoqueConc > 0.4) issues.push('elevado aprisionamento de capital em estoques');
      if (isConsumoCap) issues.push('consumo material do capital originalmente aportado pelos sócios');

      let joinedIssues = '';
      if (issues.includes('fragilidade crítica de liquidez') && issues.includes('consumo material do capital originalmente aportado pelos sócios')) {
        joinedIssues = 'fragilidade crítica de liquidez e consumo material do capital originalmente aportado pelos sócios';
      } else {
        joinedIssues = issues.length > 1 
          ? issues.slice(0, -1).join(', ') + ' e ' + issues[issues.length - 1]
          : issues[0] || 'vulnerabilidades estruturais';
      }

      patrimonialThesis = `A estrutura patrimonial permanece formalmente solvente, porém apresenta ${joinedIssues}.`;
    } else if (isEndivAlto) {
      patrimonialThesis = `A estrutura patrimonial apresenta solvência de ciclo imediato preservada, mas a elevada alavancagem limita a capacidade de financiar crescimento operacional.`;
    } else {
      if (score >= 80) {
        if (stage === 'capital_allocation' || strategicSeverityReason.toLowerCase().includes('excedente') || strategicSeverityReason.toLowerCase().includes('conservador')) {
          patrimonialThesis = `A robusta posição patrimonial proporciona elevada segurança financeira; contudo, a forte retenção de liquidez sugere oportunidade de otimização na alocação de capital.`;
        } else {
          patrimonialThesis = `A estrutura patrimonial é forte e resiliente, suportando crescimento sustentável com robusta margem de absorção contra choques.`;
        }
      } else if (score >= 60) {
        patrimonialThesis = `A estrutura patrimonial é estável e equilibrada, apresentando indicadores controlados sem exposição severa no ciclo imediato.`;
      } else {
        patrimonialThesis = `A estrutura patrimonial requer otimização do giro e da estrutura de capital, apesar de não apresentar rompimento imediato de liquidez.`;
      }
    }

    // 2. Risco Dominante
    let dominantRiskFamily = 'Otimização Estratégica';
    if (isLRFragil || isLSCritica) dominantRiskFamily = 'Liquidez';
    else if (isConsumoCap) dominantRiskFamily = 'Otimização Patrimonial';
    else if (isEndivAlto) dominantRiskFamily = 'Estrutura de Capital';
    else if (breakdown.workingCapitalScore !== null && breakdown.workingCapitalScore < 50) dominantRiskFamily = 'Capital de Giro';

    return {
      patrimonialThesis,
      dominantRiskFamily,
      strategicSeverity,
      strategicSeverityReason,
      overallDisclaimer: ceilingApplied ? 'Classificação final limitada por travas fiduciárias protetivas.' : null,
      rationale: 'Interpretação executiva baseada em risco dominante e priorização de conselho.',
      confidence: 100,
      lineageHash: 'PEIE-' + Date.now().toString(16).toUpperCase(),
      sourceRuntime: 'BP_RUNTIME'
    };
  }
}
