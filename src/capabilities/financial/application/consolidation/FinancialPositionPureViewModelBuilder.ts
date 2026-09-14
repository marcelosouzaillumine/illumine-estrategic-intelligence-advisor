import { FinancialPositionPureViewModel, FinancialIndicator } from '../../../../core/experience/contracts/FinancialPositionPureViewModel';
import { IntelligenceSignal } from '../../contracts/IntelligenceSignal';
import { FinancialPositionIntelligenceContract } from '../../contracts/FinancialPositionIntelligenceContract';

export interface PureFinancialDataInput {
  balanceSheet: any;
  indicators: any[];
  historicalSeries: any[];
  intelligenceContract: FinancialPositionIntelligenceContract;
}

export class FinancialPositionPureViewModelBuilder {
  public static build(input: PureFinancialDataInput): FinancialPositionPureViewModel {
    const { balanceSheet, indicators, historicalSeries, intelligenceContract } = input;

    
    // Map indicators safely, stripping away legacy semantics
    const mapIndicator = (raw: any): FinancialIndicator => {
      let availability: 'AVAILABLE' | 'ZERO' | 'NOT_APPLICABLE' | 'UNAVAILABLE' | 'UNSUPPORTED' = 'AVAILABLE';
      let value = raw.value;
      if (value === undefined || value === null) {
        availability = 'UNAVAILABLE';
      } else if (value === 'NOT_APPLICABLE') {
        availability = 'NOT_APPLICABLE';
      } else if (value === 0) {
        availability = 'ZERO';
      }

      let formattedValue = '';
      if (availability === 'UNAVAILABLE') {
        formattedValue = 'Dados insuficientes';
      } else if (availability === 'NOT_APPLICABLE') {
        formattedValue = 'Não aplicável';
      } else {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            // Basic formatting, relies on unit or name if available
            if (raw.unit === 'x') {
                formattedValue = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'x';
            } else if (raw.unit === '%') {
                formattedValue = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
            } else if (raw.unit === 'BRL') {
                formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numValue);
            } else if (raw.name?.toLowerCase().includes('liquidez')) {
                formattedValue = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'x';
            } else {
                formattedValue = numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        } else {
            formattedValue = String(value);
        }
      }

      return {
        code: raw.code || raw.metricName || raw.id || 'UNKNOWN',
        name: raw.name || raw.label || 'Indicador',
        value: typeof value === 'number' ? value : undefined,
        formattedValue: formattedValue,
        classification: raw.classification || raw.status || 'NEUTRAL',
        
        availability: availability,
        observation: raw.observation || raw.interpretation || 'Fato observado no balanço patrimonial', // Default fallback
        evidence: raw.evidence || 'Dados contábeis',
        financialMeaning: raw.financialMeaning || raw.interpretation || 'Proporção extraída dos dados'
      };
    };

    return {
      overview: {
        healthStatus: intelligenceContract.overview.healthStatus,
        confidence: intelligenceContract.overview.confidence,
        drivers: intelligenceContract.overview.drivers,
        observation: intelligenceContract.overview.observation,
        evidence: intelligenceContract.overview.evidence,
        financialMeaning: intelligenceContract.overview.financialMeaning
      },
      diagnosis: {
        liquidity: (intelligenceContract.diagnosis.liquidity || []).map(mapIndicator),
        solvencyAndCapitalStructure: (intelligenceContract.diagnosis.solvencyAndCapitalStructure || []).map(mapIndicator),
        workingCapital: (intelligenceContract.diagnosis.workingCapital || []).map(mapIndicator),
        assetQuality: (intelligenceContract.diagnosis.assetQuality || []).map(mapIndicator)
      },
      signals: {
        state: intelligenceContract.signals.items && intelligenceContract.signals.items.length > 0 ? 'AVAILABLE_WITH_SIGNALS' : 'AVAILABLE_EMPTY',
        available: intelligenceContract.signals.available,
        items: intelligenceContract.signals.items || [],
        availabilityReason: intelligenceContract.signals.missingReason
      },
      historicalEvolution: intelligenceContract.historicalEvolution.available ? 
        {
          available: true,
          ...((intelligenceContract.historicalEvolution.items as any)?.[0] || {})
        } : 
        {
          available: false,
          periodCoverage: { firstYear: 0, lastYear: 0, periodsAnalyzed: 0 },
          trajectory: { classification: 'insufficient', confidence: 'low', explanation: '' },
          movements: [],
          executiveContext: { observation: '', implication: '' },
          availabilityReason: intelligenceContract.historicalEvolution.missingReason
        } as any,
      score: intelligenceContract.score.available ? {
        available: true,
        overall: (intelligenceContract.score as any).overall,
        dimensions: (intelligenceContract.score as any).dimensions,
        methodology: (intelligenceContract.score as any).methodology
      } : undefined,
      executiveQuestions: (intelligenceContract.executiveQuestions.items as any) || [],
      technicalEvidence: {
        available: intelligenceContract.technicalEvidence.available,
        bpSummary: (intelligenceContract.technicalEvidence as any).items?.[0]?.bpSummary || {},
        rows: (intelligenceContract.technicalEvidence as any).items?.[0]?.rows || [],
        auditMetadata: (intelligenceContract.technicalEvidence as any).items?.[0]?.auditMetadata || {},
        structuralTables: (intelligenceContract.technicalEvidence as any).items?.[0]?.structuralTables || [],
        availabilityReason: intelligenceContract.technicalEvidence.missingReason
      }
    };
  }
}
