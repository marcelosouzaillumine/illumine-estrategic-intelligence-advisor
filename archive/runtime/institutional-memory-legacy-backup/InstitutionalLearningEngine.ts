import { HistoricalCycleData, InstitutionalLearningSignals } from './types';
import { RecommendationPersistenceTracker } from './RecommendationPersistenceTracker';
import { LongitudinalMaturityEngine } from './LongitudinalMaturityEngine';

export class InstitutionalLearningEngine {
  /**
   * Avalia os sinais de aprendizado institucional da plataforma.
   * Não utiliza inferência opaca ou IA generativa, baseando-se estritamente
   * na persistência e recorrência dos dados históricos (Lineage).
   */
  public static evaluate(cycles: HistoricalCycleData[], minRecurrence: number = 3): InstitutionalLearningSignals {
    if (!cycles || cycles.length < minRecurrence) {
      // Fail-closed se não houver histórico mínimo configurável
      return {
        advisoryAdherenceScore: 50,
        governanceFatigueScore: 0,
        executiveResponsivenessScore: 50,
        structuralResilienceScore: 50,
        operationalPersistenceScore: 0
      };
    }

    const advisoryAdherenceScore = LongitudinalMaturityEngine.calculateAdvisoryAdherence(cycles);
    const operationalPersistenceScore = LongitudinalMaturityEngine.calculateOperationalPersistence(cycles);
    const resilienceTrend = LongitudinalMaturityEngine.calculateResilienceTrend(cycles);

    // Fatigue = Advisory alto sendo ignorado repetidamente
    const ignoredRecommendations = RecommendationPersistenceTracker.trackIgnored(cycles);
    const ignoredCount = ignoredRecommendations.length;
    // Cada recomendação ignorada em 3 ciclos soma 20 pontos de fadiga
    let governanceFatigueScore = ignoredCount * 20;
    governanceFatigueScore = Math.min(100, Math.max(0, governanceFatigueScore));

    // Responsiveness é inversamente proporcional à fadiga, 
    // mas balanceado pela velocidade que as coisas mudam (resilienceTrend).
    let executiveResponsivenessScore = advisoryAdherenceScore - (governanceFatigueScore / 2);
    executiveResponsivenessScore = Math.min(100, Math.max(0, executiveResponsivenessScore));

    // Structural Resilience Score: Se a empresa passa por crises e melhora
    const structuralResilienceScore = resilienceTrend;

    return {
      advisoryAdherenceScore,
      governanceFatigueScore,
      executiveResponsivenessScore,
      structuralResilienceScore,
      operationalPersistenceScore
    };
  }
}
