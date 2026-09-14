import { 
  ExecutiveDecisionEvent, 
  DecisionMemoryOutput, 
  DecisionCategory 
} from './InstitutionalDecisionTypes';

export class DecisionMemoryLayer {
  public static evaluate(decisions: ExecutiveDecisionEvent[]): DecisionMemoryOutput {
    // Fail-Closed: Não inferir negligência sem evento registrado
    if (!decisions || decisions.length === 0) {
      return {
        recurringDecisionPatterns: [],
        destructiveDecisionRecurrence: false,
        correctiveDecisionEvidence: false,
        institutionalLearningSignal: 'NOT_AVAILABLE',
        decisionDisciplineScore: 'NOT_AVAILABLE',
        decisionMemoryWarnings: ['Ausência de eventos decisórios estruturados. Avaliação de memória decisória bloqueada.']
      };
    }

    // Identificar decisões recorrentes
    const frequencyMap = new Map<DecisionCategory, number>();
    for (const d of decisions) {
      frequencyMap.set(d.decisionType, (frequencyMap.get(d.decisionType) || 0) + 1);
    }
    
    const recurringDecisionPatterns: DecisionCategory[] = [];
    frequencyMap.forEach((count, type) => {
      if (count > 1) recurringDecisionPatterns.push(type);
    });

    let destructiveCount = 0;
    let correctiveCount = 0;

    decisions.forEach(d => {
      const { fcoImpact, runwayImpactMonths } = d.observedImpact;
      
      // Decisão destrutiva: Piora FCO E Piora Runway
      if (fcoImpact < 0 && runwayImpactMonths < 0) {
        destructiveCount++;
      }
      
      // Decisão corretiva: Melhora Runway (podendo vir ou não de FCO)
      if (runwayImpactMonths > 0 && d.fiduciaryRiskFlag === false) {
        correctiveCount++;
      }
    });

    const destructiveDecisionRecurrence = destructiveCount > 1;
    const correctiveDecisionEvidence = correctiveCount > 0;

    let institutionalLearningSignal: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'NOT_AVAILABLE' = 'NEUTRAL';
    if (destructiveDecisionRecurrence && !correctiveDecisionEvidence) {
      institutionalLearningSignal = 'NEGATIVE';
    } else if (correctiveDecisionEvidence && !destructiveDecisionRecurrence) {
      institutionalLearningSignal = 'POSITIVE';
    }

    let decisionDisciplineScore: number = 50;
    if (institutionalLearningSignal === 'NEGATIVE') {
      decisionDisciplineScore = Math.max(10, 50 - (destructiveCount * 10));
    } else if (institutionalLearningSignal === 'POSITIVE') {
      decisionDisciplineScore = Math.min(100, 50 + (correctiveCount * 15));
    }

    const decisionMemoryWarnings: string[] = [];
    if (destructiveDecisionRecurrence) {
      decisionMemoryWarnings.push('Padrão de decisões destrutivas recorrentes detectado (Impacto negativo em FCO e Runway).');
    }
    if (recurringDecisionPatterns.includes('EMERGENCY_CAPITALIZATION')) {
      decisionMemoryWarnings.push('Recorrência crônica de capitalização emergencial detectada na memória de decisões.');
    }

    return {
      recurringDecisionPatterns,
      destructiveDecisionRecurrence,
      correctiveDecisionEvidence,
      institutionalLearningSignal,
      decisionDisciplineScore,
      decisionMemoryWarnings
    };
  }
}
