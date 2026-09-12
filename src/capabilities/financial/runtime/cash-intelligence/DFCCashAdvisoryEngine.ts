import { CashBoardDecision, CashSustainability, CashConfidenceLevel, DFCCashAdvisory } from './CashIntelligenceTypes';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../executive-consolidation/StrategicOpinionConsistencyEngine';

export class DFCCashAdvisoryEngine {
  public static evaluate(
    fco: number,
    boardDecision: CashBoardDecision,
    sustainability: CashSustainability,
    confidence: CashConfidenceLevel,
    context?: ExecutiveAnalysisContext
  ): DFCCashAdvisory {
    const isBurning = fco <= 0;
    const isResilient = sustainability.classification === 'AUTOSSUSTENTADA'; // removed PRESERVACAO_DE_CAPITAL as it has no overlap

    const safeContext = context || {
      analysisYear: new Date().getFullYear(), generatedAt: new Date().toISOString(), moduleContext: 'DFC',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: sustainability.classification,
      mathematicalClassification: isResilient ? 'RESILIENT' : (isBurning ? 'CRITICAL' : 'ATTENTION'),
      globalScore: 50,
      primaryIndicators: {},
      contextualAlerts: []
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(safeContext);

    // Build legacy fields based on opinion and boardDecision
    const restricaoPrincipal = boardDecision.primaryConstraint;
    const dependenciaCapital = boardDecision.shareholderDependency;
    const sustentabilidade = boardDecision.boardOutlook;
    const prioridadeEstrategica = opinion.prioridadeEstrategica;
    const situacaoAtual = opinion.situacaoAtual;

    const parecerConsolidado = `${situacaoAtual}\n\nRestrição Principal: ${restricaoPrincipal}\n\nDependência de Capital: ${dependenciaCapital}\n\nSustentabilidade: ${sustentabilidade}\n\nPrioridade Estratégica: ${prioridadeEstrategica}`;

    return {
      situacaoAtual,
      restricaoPrincipal,
      dependenciaCapital,
      sustentabilidade,
      parecerConsolidado,
      outlook: prioridadeEstrategica,
      confidenceLevel: confidence
    };
  }
}
