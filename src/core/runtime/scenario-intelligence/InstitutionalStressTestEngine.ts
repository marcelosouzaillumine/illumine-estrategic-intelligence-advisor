// src/core/runtime/scenario-intelligence/InstitutionalStressTestEngine.ts
import { PropagationSimulationProfile, ScenarioInput } from './scenario-types';

export interface StressTestResult {
  resilienceScore: number;
  survivalPressure: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA';
  treasurySustainability: boolean;
  structuralVulnerabilities: string[];
}

export class InstitutionalStressTestEngine {
  public static execute(
    inputs: ScenarioInput[],
    propagationProfile: PropagationSimulationProfile,
    contextData: any
  ): StressTestResult {
    
    let resilienceScore = 100;
    const structuralVulnerabilities: string[] = [];

    // Avalia o impacto das cadeias de propagação
    const hasCritical = propagationProfile.nodes.some(n => n.severity === 'CRÍTICA');
    const hasHigh = propagationProfile.nodes.some(n => n.severity === 'ALTA');

    if (hasCritical) resilienceScore -= 40;
    else if (hasHigh) resilienceScore -= 20;

    propagationProfile.edges.forEach(edge => {
      if (edge.target.dimension === 'LIQUIDITY' && edge.target.impactDirection === 'NEGATIVE') {
        resilienceScore -= 15;
        structuralVulnerabilities.push(`Vulnerabilidade em ${edge.target.metric} causada por ${edge.mechanism}`);
      }
      if (edge.target.dimension === 'FUNDING' && edge.target.impactDirection === 'POSITIVE') {
        resilienceScore -= 20;
        structuralVulnerabilities.push(`Exposição ao Risco de Funding ativada por ${edge.mechanism}`);
      }
    });

    resilienceScore = Math.max(0, resilienceScore);

    let survivalPressure: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA' = 'BAIXA';
    if (resilienceScore < 30) survivalPressure = 'CRÍTICA';
    else if (resilienceScore < 60) survivalPressure = 'ALTA';
    else if (resilienceScore < 80) survivalPressure = 'MODERADA';

    const treasurySustainability = resilienceScore >= 50;

    return {
      resilienceScore,
      survivalPressure,
      treasurySustainability,
      structuralVulnerabilities
    };
  }
}
