import { RankedScenario } from './ScenarioRankingEngine';

export interface ScenarioTradeOffs {
  scenarioId: string;
  gains: string[];
  losses: string[];
  requirements: string[];
}

export function analyzeTradeOffs(
  targetScenario: RankedScenario,
  baselineScenario?: RankedScenario
): ScenarioTradeOffs {
  const gains: string[] = [];
  const losses: string[] = [];
  const requirements: string[] = [];

  if (!baselineScenario) {
    gains.push('Estabelece o novo patamar base de valor econômico.');
    requirements.push('Requer estruturação inicial da governança corporativa.');
    return { scenarioId: targetScenario.scenarioId, gains, losses, requirements };
  }

  // Value comparison
  if (targetScenario.enterpriseValue > baselineScenario.enterpriseValue) {
    gains.push('Maior potencial de geração de Enterprise Value frente ao Baseline.');
  } else if (targetScenario.enterpriseValue < baselineScenario.enterpriseValue) {
    losses.push('Menor geração de Enterprise Value frente ao Baseline.');
  }

  // Execution Capacity (IEI)
  if (targetScenario.ieiScore < baselineScenario.ieiScore) {
    losses.push('Reduz a capacidade de execução segura da organização.');
  } else if (targetScenario.ieiScore > baselineScenario.ieiScore) {
    gains.push('Aumenta a probabilidade de execução operacional bem-sucedida.');
  }

  // Gap & Pressure (IRG & GPI)
  if (targetScenario.irgScore > baselineScenario.irgScore) {
    requirements.push('Exige reforço imediato de governança e controles institucionais.');
  }
  if (targetScenario.gpiScore > 60) {
    requirements.push('Aumenta a pressão operacional sobre os processos e lideranças atuais.');
  }

  if (gains.length === 0) gains.push('Manutenção da estabilidade operacional vigente.');
  if (losses.length === 0) losses.push('Nenhum trade-off negativo severo identificado contra o Baseline.');

  return {
    scenarioId: targetScenario.scenarioId,
    gains,
    losses,
    requirements
  };
}
