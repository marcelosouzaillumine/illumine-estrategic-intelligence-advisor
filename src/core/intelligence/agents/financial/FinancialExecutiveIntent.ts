export enum FinancialExecutiveIntent {
  HEALTH_ASSESSMENT = 'HEALTH_ASSESSMENT',
  CAUSE_INVESTIGATION = 'CAUSE_INVESTIGATION',
  STRATEGIC_EXPLORATION = 'STRATEGIC_EXPLORATION',
  METRIC_EXPLANATION = 'METRIC_EXPLANATION',
  TREND_ANALYSIS = 'TREND_ANALYSIS',
  DECISION_SUPPORT = 'DECISION_SUPPORT',
  SCENARIO_ANALYSIS = 'SCENARIO_ANALYSIS',
  EXECUTIVE_SUMMARY = 'EXECUTIVE_SUMMARY',
  BOARD_PREPARATION = 'BOARD_PREPARATION',
  UNKNOWN = 'UNKNOWN'
}

export class FinancialIntentClassifier {
  public classify(question: string): FinancialExecutiveIntent {
    const q = question.toLowerCase();

    if (q.includes('conselho') || q.includes('board') || q.includes('levar ao conselho')) {
      return FinancialExecutiveIntent.BOARD_PREPARATION;
    }
    
    if (q.includes('decidir') || q.includes('devemos') || q.includes('posso acelerar')) {
      return FinancialExecutiveIntent.DECISION_SUPPORT;
    }
    
    if (q.includes('cenário') || q.includes('se cair') || q.includes('se aumentar')) {
      return FinancialExecutiveIntent.SCENARIO_ANALYSIS;
    }

    if (q.includes('por que') || q.includes('causa') || q.includes('motivo')) {
      return FinancialExecutiveIntent.CAUSE_INVESTIGATION;
    }
    
    if (q.includes('o que significa') || q.includes('explique')) {
      return FinancialExecutiveIntent.METRIC_EXPLANATION;
    }

    if (q.includes('evolução') || q.includes('piorando') || q.includes('melhorando') || q.includes('tendência')) {
      return FinancialExecutiveIntent.TREND_ANALYSIS;
    }
    
    if (q.includes('saúde') || q.includes('saudável') || q.includes('liquidez')) {
      return FinancialExecutiveIntent.HEALTH_ASSESSMENT;
    }
    
    if (q.includes('resumo') || q.includes('resuma')) {
      return FinancialExecutiveIntent.EXECUTIVE_SUMMARY;
    }
    
    if (q.includes('explorar') || q.includes('alternativas') || q.includes('caminhos')) {
      return FinancialExecutiveIntent.STRATEGIC_EXPLORATION;
    }

    return FinancialExecutiveIntent.UNKNOWN;
  }
}
