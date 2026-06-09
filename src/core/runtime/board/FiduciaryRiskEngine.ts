import { BoardIntelligenceInput } from './BoardIntelligenceAdapter';

export type RiskLevel = 'Baixo' | 'Moderado' | 'Elevado' | 'Crítico';

export interface FiduciaryRiskReport {
  overallRisk: RiskLevel;
  financialRisk: { level: RiskLevel; reason: string };
  institutionalRisk: { level: RiskLevel; reason: string };
  executionRisk: { level: RiskLevel; reason: string };
  governanceRisk: { level: RiskLevel; reason: string };
}

function calculateLevel(score: number, invert: boolean = false): RiskLevel {
  // If invert is false: lower score = worse risk (e.g., IEI)
  // If invert is true: higher score = worse risk (e.g., IRG, GPI)
  if (!invert) {
    if (score < 40) return 'Crítico';
    if (score < 60) return 'Elevado';
    if (score < 75) return 'Moderado';
    return 'Baixo';
  } else {
    if (score > 70) return 'Crítico';
    if (score > 60) return 'Elevado';
    if (score > 40) return 'Moderado';
    return 'Baixo';
  }
}

export function assessFiduciaryRisks(input: BoardIntelligenceInput): FiduciaryRiskReport {
  // Financial Risk (Value Delta vs Baseline or absolute value viability)
  let finLevel: RiskLevel = 'Baixo';
  let finReason = 'Sólida projeção de geração de valor econômico e estabilidade operacional.';
  if (input.valueDelta < 0 && !input.isBaseline) {
    finLevel = 'Elevado';
    finReason = 'Cenário projeta destruição de valor econômico em relação à trajetória atual (Baseline).';
  } else if (input.enterpriseValue <= 0) {
    finLevel = 'Crítico';
    finReason = 'Projeção crítica de valor econômico negativo ou insolvência técnica.';
  }

  // Institutional Risk (GPI)
  const instLevel = calculateLevel(input.gpiScore, true);
  let instReason = 'Pressão institucional controlada e dentro da capacidade absortiva da organização.';
  if (instLevel === 'Crítico' || instLevel === 'Elevado') {
    instReason = 'Alta pressão sistêmica detectada. O ritmo ou complexidade projetada sobrecarregará os processos corporativos atuais.';
  }

  // Execution Risk (IEI)
  const execLevel = calculateLevel(input.ieiScore, false);
  let execReason = 'Alta probabilidade de sucesso operacional na execução do plano projetado.';
  if (execLevel === 'Crítico' || execLevel === 'Elevado') {
    execReason = 'Gap significativo na capacidade executiva para entregar o cenário com sucesso. Estruturas insuficientes.';
  }

  // Governance Risk (IRG)
  const govLevel = calculateLevel(input.irgScore, true);
  let govReason = 'Controles, políticas e maturidade fiduciária adequados para o momento atual.';
  if (govLevel === 'Crítico' || govLevel === 'Elevado') {
    govReason = 'Vulnerabilidade fiduciária. Ausência de controles rigorosos e práticas de governança exigidas pelo cenário.';
  }

  // Determine overall risk
  const riskWeights = { 'Baixo': 1, 'Moderado': 2, 'Elevado': 3, 'Crítico': 4 };
  const maxRiskValue = Math.max(
    riskWeights[finLevel],
    riskWeights[instLevel],
    riskWeights[execLevel],
    riskWeights[govLevel]
  );
  
  let overallRisk: RiskLevel = 'Baixo';
  if (maxRiskValue === 4) overallRisk = 'Crítico';
  else if (maxRiskValue === 3) overallRisk = 'Elevado';
  else if (maxRiskValue === 2) overallRisk = 'Moderado';

  return {
    overallRisk,
    financialRisk: { level: finLevel, reason: finReason },
    institutionalRisk: { level: instLevel, reason: instReason },
    executionRisk: { level: execLevel, reason: execReason },
    governanceRisk: { level: govLevel, reason: govReason }
  };
}
