import { TechnicalAssessmentPackage } from '../contracts/TechnicalAssessmentPackage';
import { FinancialAssessmentPipeline } from './FinancialAssessmentPipeline';
import { EconomicAssessmentPipeline } from './EconomicAssessmentPipeline';
import { ExecutiveDeliberationSupportEngine } from '../deliberation/ExecutiveDeliberationSupportEngine';
import { ExecutiveQuestion } from '../domain/ExecutiveQuestion';
import { BoardPackage } from '../contracts/BoardPackage';

export class InstitutionalDecisionOS {
  /**
   * Ponto de entrada canônico do Executive Decision Operating System™ (EDOS).
   */
  public static runSession(
    question: ExecutiveQuestion,
    financialData: any,
    economicData?: any,
    cashData?: any
  ): BoardPackage {
    
    // 1. Pipeline de Avaliações Técnicas (Assessments)
    const financialAssessment = FinancialAssessmentPipeline.run(financialData);
    
    // Placeholder for other assessments (Economic/DRE, Cash/DFC)
    const economicAssessment = economicData ? EconomicAssessmentPipeline.run(economicData) : undefined;
    const cashAssessment = cashData ? { ...financialAssessment, domain: 'CASH_FLOW' as const } : undefined;

    const assessmentPackage: TechnicalAssessmentPackage = {
      sessionId: `SESSION-${Date.now()}`,
      generatedAt: new Date(),
      financialAssessment,
      economicAssessment,
      cashAssessment,
      overallDataIntegrity: 0.9,
      missingDomains: []
    };

    // 2. Pipeline de Deliberação Institucional
    const boardPackage = ExecutiveDeliberationSupportEngine.deliberate(question, assessmentPackage);

    return boardPackage;
  }
}
