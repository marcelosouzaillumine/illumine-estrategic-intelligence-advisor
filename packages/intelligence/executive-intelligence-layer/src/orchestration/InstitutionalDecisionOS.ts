import { ExecutiveEvidencePackage } from '../contracts/ExecutiveEvidencePackage';
import { FinancialAssessmentPipeline } from './FinancialAssessmentPipeline';
import { DecisionPipeline } from './DecisionPipeline';
import { PresentationPipeline } from './PresentationPipeline';
import { LearningEvent } from '../learning/LearningEvent';

export class InstitutionalDecisionOS {
  /**
   * Ponto de entrada canônico do Executive Decision Governance Layer™.
   */
  public static run(
    financialData: any,
    historicalData?: any[],
    proposedIntent?: string,
    learningHistory: LearningEvent[] = []
  ): ExecutiveEvidencePackage {
    
    // Fake a hash for evidence
    const evidenceHash = `HASH-${Date.now()}`;

    // 1. Pipeline de Avaliação Financeira (Realidade)
    const { state } = FinancialAssessmentPipeline.run(financialData, historicalData);

    // 2. Pipeline de Decisão Institucional (Política, Diagnóstico e Intenção)
    const diagnosis = DecisionPipeline.run(state, proposedIntent, learningHistory, evidenceHash);

    // 3. Pipeline de Apresentação (Renderização Verbal e Empacotamento)
    const packageResult = PresentationPipeline.run(diagnosis, financialData);

    return packageResult;
  }
}
