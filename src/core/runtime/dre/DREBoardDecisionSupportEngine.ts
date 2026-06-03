import { EconomicDiagnosisOutput } from './EconomicDiagnosisEngine';

export interface BoardDecisionFramework {
  geraValor: string;
  problemaPrincipal: string;
  recuperavel: string;
  prioridade: string;
  risco: string;
}

export class DREBoardDecisionSupportEngine {
  public static generateFramework(diagnosis: EconomicDiagnosisOutput): BoardDecisionFramework {
    return {
      geraValor: diagnosis.valueCreationAssessment,
      problemaPrincipal: diagnosis.primaryConstraint,
      recuperavel: diagnosis.recoverabilityAssessment,
      prioridade: diagnosis.strategicPriority,
      risco: diagnosis.boardOutlook
    };
  }
}
