import { ExecutiveDecisionInput } from './ExecutiveDecisionTypes';

export interface RankedScenario extends ExecutiveDecisionInput {
  rankScore: number;
  rankCategory: '1º Recomendado' | '2º Alternativo' | 'Alto Risco';
  reasoning: string;
}

export function rankScenarios(scenarios: ExecutiveDecisionInput[]): RankedScenario[] {
  if (scenarios.length === 0) return [];

  // Find max EV to normalize
  const maxEv = Math.max(...scenarios.map(s => s.enterpriseValue), 1); // prevent div by zero

  const scoredScenarios = scenarios.map(s => {
    // Score factors
    const evScore = (s.enterpriseValue / maxEv) * 100; // 0 to 100
    
    // Weighting:
    // EV: 40%
    // IEI (Capacity): 30%
    // IRG (Gap/Effort Penalty): -20%
    // GPI (Pressure Penalty): -10%
    
    let rawScore = (evScore * 0.4) + (s.ieiScore * 0.3) - (s.irgScore * 0.2) - (s.gpiScore * 0.1);
    
    // Penalize heavily for critical risk
    if (s.executionRisk === 'Crítico' || s.executionRisk === 'Elevado') {
      rawScore -= 50; 
    }

    return { ...s, rankScore: rawScore };
  });

  // Sort by highest score
  scoredScenarios.sort((a, b) => b.rankScore - a.rankScore);

  return scoredScenarios.map((s, index) => {
    let rankCategory: '1º Recomendado' | '2º Alternativo' | 'Alto Risco' = 'Alto Risco';
    let reasoning = '';

    if (s.executionRisk === 'Crítico' || s.executionRisk === 'Elevado') {
      rankCategory = 'Alto Risco';
      reasoning = 'Alto risco por pressão institucional elevada ou gap crítico.';
    } else if (index === 0) {
      rankCategory = '1º Recomendado';
      reasoning = 'Recomendação executiva sugerida por melhor equilíbrio entre geração de valor e capacidade de execução segura.';
    } else {
      rankCategory = '2º Alternativo';
      if (s.enterpriseValue < scoredScenarios[0].enterpriseValue) {
        reasoning = 'Alternativa por menor valor econômico, porém com execução institucionalmente segura.';
      } else {
        reasoning = 'Alternativa com bom valor, mas superada no equilíbrio geral de risco vs retorno institucional.';
      }
    }

    return {
      ...s,
      rankCategory,
      reasoning
    };
  });
}
