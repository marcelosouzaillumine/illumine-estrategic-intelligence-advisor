import { FinancialDecisionOption } from './FinancialDecisionOption';
import { RankedOpportunity } from './OpportunityRankingEngine';
import { FinancialDiagnosticOutput } from '../FinancialDiagnosticEngine'; // Referencing Wave 1.6

export interface DecisionContext {
  diagnosis: string;
  options: FinancialDecisionOption[];
  ranking: RankedOpportunity[];
  tradeoffs: string[];
  unansweredQuestions: string[];
}

export class FinancialDecisionEngine {
  /**
   * Transforms the diagnostic output into a full Decision Context for the CFO.
   */
  public structureContext(
    diagnosisOutput: FinancialDiagnosticOutput, 
    generatedOptions: FinancialDecisionOption[],
    rankedOptions: RankedOpportunity[]
  ): DecisionContext {
    
    // Extracting questions from diagnosis or generating generic ones based on options
    const questions = [...diagnosisOutput.cfoQuestions];
    
    // Tradeoffs synthesis based on the top options
    const tradeoffs: string[] = [];
    if (rankedOptions.length >= 2) {
      const top1 = rankedOptions[0].option;
      const top2 = rankedOptions[1].option;
      tradeoffs.push(`Priorizar "${top1.title}" maximiza impacto estratégico, mas pretere temporariamente "${top2.title}".`);
    }

    if (generatedOptions.some(o => o.category === 'GROWTH') && generatedOptions.some(o => o.category === 'CAPITAL_ALLOCATION')) {
       tradeoffs.push(`O dilema central de alocação divide-se entre risco de expansão comercial vs. estabilidade da eficiência do capital.`);
    }

    return {
      diagnosis: diagnosisOutput.diagnosis,
      options: generatedOptions,
      ranking: rankedOptions,
      tradeoffs,
      unansweredQuestions: questions
    };
  }
}
