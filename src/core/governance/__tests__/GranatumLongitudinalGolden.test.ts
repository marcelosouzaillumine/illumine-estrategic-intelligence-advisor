import { describe, it, expect } from 'vitest';
import { BalanceSheetLongitudinalConsistencyEngine } from '../../runtime/governance/bp/BalanceSheetLongitudinalConsistencyEngine';
import { ClassificationTransitionEngine } from '../../runtime/governance/bp/ClassificationTransitionEngine';
import { BalanceSheetLongitudinalNarrativeGenerator } from '../../runtime/governance/bp/BalanceSheetLongitudinalNarrativeGenerator';
import { MetricNarrativeDivergenceAudit } from '../../runtime/governance/bp/MetricNarrativeDivergenceAudit';
import { RecommendationEvolutionValidator } from '../../runtime/governance/bp/RecommendationEvolutionValidator';

describe('BSLCF v1.0 - Granatum Longitudinal Golden Test', () => {
  it('should recognize patrimonial improvement from 2022 to 2023', () => {
    const historicalAvailability = 'AVAILABLE';
    
    // 2022 indicators
    const prevIndicators = {
      'Liquidez Corrente': 0.8, // Fragil
      'Endividamento Geral': 0.85, // Alto
      'Equity Buffer': 0.05 // Critico
    };
    
    // 2023 indicators
    const currIndicators = {
      'Liquidez Corrente': 1.5, // Forte
      'Endividamento Geral': 0.50, // Baixo
      'Equity Buffer': 0.40 // Saudavel
    };

    // 1. Longitudinal Consistency Engine
    const evalResult = BalanceSheetLongitudinalConsistencyEngine.evaluate(
      historicalAvailability,
      prevIndicators,
      currIndicators
    );

    expect(evalResult.improvedMetrics).toContain('Liquidez Corrente');
    expect(evalResult.improvedMetrics).toContain('Endividamento Geral');
    expect(evalResult.improvedMetrics).toContain('Equity Buffer');
    expect(evalResult.deterioratedMetrics.length).toBe(0);

    // 2. Classification Transition
    const transitionCheck = ClassificationTransitionEngine.auditTransition(
      historicalAvailability,
      'Restrita',
      'Excelente',
      evalResult.improvedMetrics
    );

    // Should NOT be blocking since we have improved metrics
    expect(transitionCheck.severity).not.toBe('BLOCKING');

    // 3. Narrative Generator
    const narrative = BalanceSheetLongitudinalNarrativeGenerator.generate(
      historicalAvailability,
      evalResult.improvedMetrics,
      evalResult.deterioratedMetrics
    );
    expect(narrative).toContain('evolução favorável');
    expect(narrative).not.toContain('deterioração patrimonial');

    // 4. Metric Narrative Divergence
    const audit = MetricNarrativeDivergenceAudit.audit(
      historicalAvailability,
      evalResult.improvedMetrics,
      evalResult.deterioratedMetrics,
      narrative
    );
    expect(audit.severity).not.toBe('BLOCKING');

    // 5. Recommendation Evolution
    const recCheck = RecommendationEvolutionValidator.validate(
      historicalAvailability,
      'Recompor liquidez',
      'Otimizar alocação de capital',
      evalResult.improvedMetrics
    );
    expect(recCheck.severity).not.toBe('WARNING');
  });

  it('should skip longitudinal analysis if historical data is insufficient', () => {
    const historicalAvailability = 'INSUFFICIENT';
    
    const evalResult = BalanceSheetLongitudinalConsistencyEngine.evaluate(
      historicalAvailability,
      {},
      { 'Liquidez Corrente': 1.5 }
    );

    expect(evalResult.consistencyScore).toBe(0);
    expect(evalResult.unavailableMetrics).toContain('Liquidez Corrente');
  });
});
