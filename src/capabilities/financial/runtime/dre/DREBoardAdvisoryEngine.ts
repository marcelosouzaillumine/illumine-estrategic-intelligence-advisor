import { NormalizedDREPayload } from './DREExecutiveDataMapper';
import { EconomicDiagnosisOutput } from './EconomicDiagnosisEngine';
import { CrossStatementIsolationValidator } from './CrossStatementIsolationValidator';
import { ExecutiveLabelGovernanceRegistry } from '../../../../core/runtime/presentation-governance';
import { StrategicOpinionConsistencyEngine, ExecutiveAnalysisContext } from '../../../../core/runtime/executive-consolidation';
import { ExecutivePrimaryMotiveConsistencyEngine } from '../../../../core/runtime/executive-consolidation';

export interface ExecutiveAdvisoryOutput {
  situacaoAtual: string;
  restricaoPrincipal: string;
  oportunidadePrincipal: string;
  prioridadeEstrategica: string;
  outlook: string;
  fullNarrative: string;
  isolationValidated: boolean;
}

export class DREBoardAdvisoryEngine {
  public static generateSynthesis(normalizedDRE: NormalizedDREPayload, diagnosis: EconomicDiagnosisOutput, context: ExecutiveAnalysisContext): string {
    const advisory = this.generateExecutiveAdvisory(normalizedDRE, diagnosis, context);
    return advisory.fullNarrative;
  }

  public static generateExecutiveAdvisory(
    normalizedDRE: NormalizedDREPayload,
    diagnosis: EconomicDiagnosisOutput,
    context?: ExecutiveAnalysisContext
  ): ExecutiveAdvisoryOutput {
    if (!normalizedDRE.netRevenue.value && normalizedDRE.netRevenue.source.startsWith('MISSING')) {
      const insufficient = 'Dados insuficientes para análise executiva desta seção.';
      return {
        situacaoAtual: insufficient,
        restricaoPrincipal: insufficient,
        oportunidadePrincipal: insufficient,
        prioridadeEstrategica: insufficient,
        outlook: insufficient,
        fullNarrative: insufficient,
        isolationValidated: true,
      };
    }

    const { primaryConstraint, strategicPriority, valueCreationAssessment, recoverabilityAssessment } = diagnosis;
    const margemBruta = normalizedDRE.grossMargin.value * 100;

    // Use unified strategic opinion engine if context is provided, else fallback to safe local generation for tests
    const safeContext = context || {
      analysisYear: new Date().getFullYear(), generatedAt: new Date().toISOString(), moduleContext: 'DRE',
      activeFiduciaryRestrictions: [],
      fiduciaryClassification: recoverabilityAssessment,
      mathematicalClassification: valueCreationAssessment === 'Sim' ? 'RESILIENT' : 'ATTENTION',
      globalScore: 50,
      primaryIndicators: {},
      contextualAlerts: []
    };

    const opinion = StrategicOpinionConsistencyEngine.deriveStrategicOpinion(safeContext);

    const motive = ExecutivePrimaryMotiveConsistencyEngine.deriveExecutivePrimaryMotive(safeContext, primaryConstraint);
    
    // Restrição Principal — validada pelo isolamento cross-statement
    const rawConstraint = motive.label;
    const restricaoPrincipal = ExecutiveLabelGovernanceRegistry.sanitize(rawConstraint);

    // Oportunidade Principal (domínio DRE exclusivo)
    let oportunidadePrincipal = 'Expansão do volume de receita para diluição da estrutura fixa.';
    if (margemBruta > 40) {
      oportunidadePrincipal = `A margem bruta de ${margemBruta.toFixed(0)}% demonstra potencial de geração de valor. A oportunidade central está em ampliar o volume para absorver a estrutura.`;
    }

    const isolationValidated = CrossStatementIsolationValidator.validateDRERecommendation(opinion.fullNarrative).isValid;

    return {
      situacaoAtual: opinion.situacaoAtual,
      restricaoPrincipal,
      oportunidadePrincipal,
      prioridadeEstrategica: opinion.prioridadeEstrategica,
      outlook: opinion.outlook,
      fullNarrative: opinion.fullNarrative,
      isolationValidated,
    };
  }
}
