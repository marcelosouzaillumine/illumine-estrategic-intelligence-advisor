export interface ExecutiveQuestion {
  id: string;
  questionType: 'INVESTMENT' | 'DIVIDEND' | 'HIRING' | 'DEBT' | 'RESTRUCTURING' | 'ACQUISITION' | 'UNKNOWN';
  text: string;    // e.g. "Podemos expandir a capacidade produtiva em 2027?"
  
  decisionContext: {
    currentState: string;
    constraints: string[];
    strategicMoment: string;
  };
  
  businessProblem: string;
  decisionToEnable: string;
  strategicHypothesis: string;
  financialImpact: string;
  timeHorizon: string;
  decisionMaker: string;
  
  decisionCriteria: string[];
  successDefinition: string;
  nonNegotiables: string[];
  stakeholders: string[];

  askedBy: string; // The user or the system actor who initiated the question
  askedAt: Date;
}
