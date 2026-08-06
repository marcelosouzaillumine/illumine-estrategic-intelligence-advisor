import { FinancialPositionPureViewModel, FinancialIndicator, IntelligenceSignal, TechnicalEvidence, HistoricalSeries } from '../../experience/contracts/FinancialPositionPureViewModel';

export interface PureFinancialDataInput {
  balanceSheet: any;
  indicators: any[];
  historicalSeries: any[];
  metadata: any;
}

export class FinancialPositionPureViewModelBuilder {
  public static build(input: PureFinancialDataInput): FinancialPositionPureViewModel {
    const { balanceSheet, indicators, historicalSeries, metadata } = input;
    
    // Map indicators safely, stripping away legacy semantics
    const mapIndicator = (raw: any): FinancialIndicator => ({
      code: raw.code || raw.metricName || 'UNKNOWN',
      name: raw.name || raw.label || 'Indicador',
      value: raw.value || 0,
      classification: raw.classification || 'NEUTRAL',
      observation: 'Fato observado no balanço patrimonial', // Default fallback
      evidence: 'Dados contábeis',
      financialMeaning: 'Proporção extraída dos dados'
    });

    const liquidityIndicators = indicators.filter(i => i.family === 'Liquidez' || i.category === 'Liquidez').map(mapIndicator);
    const capitalStructureIndicators = indicators.filter(i => i.family === 'Estrutura de Capital' || i.category === 'Estrutura de Capital').map(mapIndicator);
    const workingCapitalIndicators = indicators.filter(i => i.family === 'Capital de Giro' || i.category === 'Capital de Giro').map(mapIndicator);
    const assetQualityIndicators = indicators.filter(i => i.family === 'Qualidade do Ativo' || i.category === 'Qualidade do Ativo').map(mapIndicator);

    // Filter historical series to pure numbers
    const pureHistory: HistoricalSeries[] = historicalSeries.map(s => ({
      year: s.year || new Date().getFullYear(),
      data: s.data || {}
    }));

    return {
      overview: {
        healthStatus: metadata?.healthStatus || 'NEUTRAL',
        confidence: metadata?.confidence || 'HIGH',
        drivers: metadata?.drivers || [],
        observation: 'Estrutura patrimonial analisada com base nos dados contábeis fornecidos.',
        evidence: 'Ativos, Passivos e Patrimônio Líquido.',
        financialMeaning: 'Situação financeira observada no encerramento do exercício.'
      },
      diagnosis: {
        liquidity: liquidityIndicators,
        capitalStructure: capitalStructureIndicators,
        workingCapital: workingCapitalIndicators,
        assetQuality: assetQualityIndicators
      },
      signals: [], // Will be mapped by signals engine if needed, but strictly typed
      historicalEvolution: pureHistory,
      executiveQuestions: [], // Strictly questions, no decisions
      technicalEvidence: [] // strictly technical metadata
    };
  }
}
