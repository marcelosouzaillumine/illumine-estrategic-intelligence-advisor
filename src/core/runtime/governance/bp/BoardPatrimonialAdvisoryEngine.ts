import { PatrimonialIndicator } from './BalanceSheetFinancialMetricsEngine';
import { PatrimonialInterpretationOutput } from './PatrimonialExecutiveInterpretationEngine';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../../executive-consolidation/StrategicOpinionConsistencyEngine';

export interface BoardAdvisoryReport {
  situacaoPatrimonial: string;
  liquidez: string;
  preservacaoCapital: string;
  estruturaCapital: string;
  recomendacaoPrioritaria: string;
  fullText: string;
  boardAssessment: {
    patrimonialSituation: string;
    liquidityAssessment: string;
    capitalPreservationAssessment: string;
    capitalStructureAssessment: string;
    boardRecommendation: string;
  };
}

export class BoardPatrimonialAdvisoryEngine {
  public static generate(
    indicators: PatrimonialIndicator[],
    interpretations: PatrimonialInterpretationOutput,
    context: ExecutiveAnalysisContext
  ): BoardAdvisoryReport {
    
    // Leverage the new StrategicOpinionConsistencyEngine to avoid hardcoded contradictions
    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(context);

    // Map unified opinion back to BP-specific legacy properties where required
    return {
      situacaoPatrimonial: opinion.situacaoAtual,
      liquidez: '', // Unified inside fullNarrative
      preservacaoCapital: '', // Unified inside fullNarrative
      estruturaCapital: '', // Unified inside fullNarrative
      recomendacaoPrioritaria: opinion.prioridadeEstrategica,
      fullText: opinion.fullNarrative,
      boardAssessment: {
        patrimonialSituation: opinion.situacaoAtual,
        liquidityAssessment: '',
        capitalPreservationAssessment: '',
        capitalStructureAssessment: '',
        boardRecommendation: opinion.prioridadeEstrategica
      }
    };
  }
}
