import { ExecutiveDecisionInput } from './ExecutiveDecisionTypes';
import { rankScenarios, RankedScenario } from './ScenarioRankingEngine';
import { analyzeTradeOffs, ScenarioTradeOffs } from './TradeOffAnalysisEngine';

export interface ExecutiveDecisionOutput {
  recommendedScenario: string;
  recommendationLevel: string; // 'Recomendado', 'Alternativo', 'Alto Risco'
  confidenceLevel: string; // 'Alta', 'Média', 'Baixa'
  executiveSummary: string;
  tradeOffs: ScenarioTradeOffs;
  strategicWarnings: string[];
  rankedScenarios: RankedScenario[];
}

export function evaluateExecutiveDecision(scenarios: ExecutiveDecisionInput[], baselineScenarioId?: string): ExecutiveDecisionOutput {
  if (scenarios.length === 0) {
    throw new Error("Não há contextos disponíveis para avaliação executiva.");
  }

  const rankedScenarios = rankScenarios(scenarios);
  
  // The first scenario in ranked list is our recommended one
  const recommended = rankedScenarios.find(s => s.rankCategory === '1º Recomendado') || rankedScenarios[0];
  
  const baseline = baselineScenarioId 
    ? rankedScenarios.find(s => s.scenarioId === baselineScenarioId) 
    : undefined;

  const tradeOffs = analyzeTradeOffs(recommended, baseline);

  let confidenceLevel = 'Média';
  if (recommended.ieiScore >= 70 && recommended.irgScore <= 30) {
    confidenceLevel = 'Alta';
  } else if (recommended.irgScore >= 70 || recommended.gpiScore >= 70) {
    confidenceLevel = 'Baixa';
  }

  const strategicWarnings: string[] = [];
  if (recommended.executionRisk === 'Crítico' || recommended.executionRisk === 'Elevado') {
    strategicWarnings.push("A recomendação sugerida ainda carrega alto risco institucional devido à complexidade da operação.");
  }
  if (recommended.irgScore >= 60) {
    strategicWarnings.push("A implementação da Jornada de Governança (Roadmap) é pré-requisito para o sucesso deste contexto.");
  }

  let executiveSummary = `Entre os contextos avaliados, o contexto "${recommended.scenarioName}" apresenta a melhor relação simulada entre geração de valor, capacidade de execução e maturidade institucional.`;
  if (confidenceLevel === 'Baixa') {
    executiveSummary += ` Contudo, os níveis de pressão de governança (GPI) e capacidade de execução atual (IEI) indicam que sua implementação demandará forte apoio técnico e metodológico. `;
  }
  executiveSummary += ` Recomendação executiva sugerida com base nos critérios avaliados, acompanhada da implementação prioritária do Roadmap Institucional recomendado.`;

  return {
    recommendedScenario: recommended.scenarioName,
    recommendationLevel: recommended.rankCategory,
    confidenceLevel,
    executiveSummary,
    tradeOffs,
    strategicWarnings,
    rankedScenarios
  };
}
