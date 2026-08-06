// src/core/runtime/scenario-intelligence/ScenarioNarrativeComposer.ts
import { InstitutionalScenarioResult, PropagationSimulationProfile } from './scenario-types';
import { StressTestResult } from './InstitutionalStressTestEngine';

export class ScenarioNarrativeComposer {
  public static compose(
    scenarioResult: InstitutionalScenarioResult, 
    stressResult?: StressTestResult
  ): string {
    if (scenarioResult.validation.status !== 'VALID') {
      return `Simulação bloqueada por inconsistência estrutural fiduciária: ${scenarioResult.validation.reason}`;
    }

    if (!scenarioResult.propagationProfile || scenarioResult.propagationProfile.edges.length === 0) {
      return 'Nenhuma propagação material observada sob as restrições atuais.';
    }

    const { systemicSeverity, structuralIntegrityScore } = scenarioResult.propagationProfile;
    
    let lead = 'A propagação estrutural observada indica estabilidade relativa nas dimensões centrais de capital.';
    if (systemicSeverity === 'CRÍTICA') {
      lead = 'A propagação estrutural observada evidencia forte pressão de liquidez operacional e resiliência reduzida de tesouraria.';
    } else if (systemicSeverity === 'ALTA') {
      lead = 'A propagação observada indica consumo acelerado de capital, tensionando a sustentabilidade de ciclo imediato.';
    }

    let resilienceStr = '';
    if (stressResult) {
      if (stressResult.survivalPressure === 'CRÍTICA') {
        resilienceStr = `O estresse simulado revela vulnerabilidade sistêmica, com Score de Resiliência de ${stressResult.resilienceScore}/100.`;
      } else {
        resilienceStr = `O estresse simulado mantém o Score de Resiliência em ${stressResult.resilienceScore}/100, indicando capacidade de absorção institucional.`;
      }
    }

    return `${lead} ${resilienceStr}`;
  }
}
