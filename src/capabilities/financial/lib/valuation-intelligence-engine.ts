import type {
  ValuationImpactSignal,
  ValuationIntelligence,
  ValuationIntelligenceInput,
  ValuationReadinessClassification,
  ValuationRiskSignal,
} from "./valuation-intelligence-types";

const FIDUCIARY_DISCLAIMER =
  "Esta camada produz inteligência de valuation e prontidão para avaliação empresarial, sem calcular valor da empresa, preço justo, DCF, múltiplos, WACC, terminal value, equity value ou enterprise value.";

function classifyValuationReadiness(
  input: ValuationIntelligenceInput,
): ValuationReadinessClassification {
  const positiveSignals =
    (input.unifiedFinancialNarrative ? 1 : 0) +
    (input.executiveFinancialStory ? 1 : 0) +
    (input.governanceIntelligence ? 1 : 0) +
    (input.governanceDigitalTwin ? 1 : 0) +
    (input.esgIntelligence ? 1 : 0) +
    (input.governanceMemory ? 1 : 0);

  if (positiveSignals >= 5) return "HIGH";
  if (positiveSignals >= 3) return "MODERATE";
  return "LOW";
}

function buildValueCreationSignals(
  input: ValuationIntelligenceInput,
): ValuationImpactSignal[] {
  const signals: ValuationImpactSignal[] = [];

  if (input.unifiedFinancialNarrative?.valueCreationSummary) {
    signals.push({
      source: "FINANCIAL",
      signal: "Há leitura consolidada de criação de valor financeiro disponível.",
    });
  }

  if (input.governanceIntelligence?.decisionEffectiveness?.effectivenessRatio) {
    signals.push({
      source: "GOVERNANCE",
      signal: "Há evidência de efetividade decisória relevante para percepção de valor.",
    });
  }

  if (input.esgIntelligence?.overallScore !== undefined) {
    signals.push({
      source: "ESG",
      signal: "Há evidência ESG estruturada que pode contribuir para leitura de valor institucional.",
    });
  }

  if (input.governanceDigitalTwin?.executionCapacity?.classification === "HIGH") {
    signals.push({
      source: "EXECUTION",
      signal: "A capacidade de execução institucional fortalece a prontidão para valuation.",
    });
  }

  return signals;
}

function buildValueDestructionRisks(
  input: ValuationIntelligenceInput,
): ValuationRiskSignal[] {
  const risks: ValuationRiskSignal[] = [];

  if ((input.governanceIntelligence?.persistentRisks?.length ?? 0) > 0) {
    risks.push({
      source: "GOVERNANCE",
      risk: "Riscos persistentes podem comprometer a percepção de valor institucional.",
    });
  }

  if (input.governanceDigitalTwin?.executionCapacity?.classification === "LOW") {
    risks.push({
      source: "EXECUTION",
      risk: "Baixa capacidade de execução pode limitar a conversão de estratégia em valor.",
    });
  }

  if (input.esgIntelligence?.overallScore !== undefined && input.esgIntelligence.overallScore < 50) {
    risks.push({
      source: "ESG",
      risk: "Baixa maturidade ESG pode representar risco reputacional e institucional.",
    });
  }

  if ((input.governanceMemory?.recurringRisks?.length ?? 0) > 0) {
    risks.push({
      source: "MEMORY",
      risk: "Riscos recorrentes na memória institucional indicam fragilidades de tratamento.",
    });
  }

  return risks;
}

function buildGovernanceValuationImpact(
  input: ValuationIntelligenceInput,
): string {
  if (!input.governanceIntelligence) {
    return "Impacto de governança no valuation não disponível neste relatório.";
  }
  if (input.governanceIntelligence.decisionEffectiveness.effectivenessRatio >= 0.8) {
    return "A efetividade decisória fortalece a percepção de maturidade institucional para valuation.";
  }
  return "A efetividade decisória requer acompanhamento antes de uma leitura de valuation mais robusta.";
}

function buildEsgValuationImpact(
  input: ValuationIntelligenceInput,
): string {
  if (!input.esgIntelligence) {
    return "Impacto ESG no valuation não disponível neste relatório.";
  }
  if (input.esgIntelligence.overallScore >= 80) {
    return "A maturidade ESG fortalece a narrativa de valor institucional.";
  }
  if (input.esgIntelligence.overallScore >= 50) {
    return "A maturidade ESG contribui parcialmente para a narrativa de valor institucional.";
  }
  return "A maturidade ESG ainda representa ponto de atenção para a narrativa de valor.";
}

function buildExecutionValuationImpact(
  input: ValuationIntelligenceInput,
): string {
  const classification = input.governanceDigitalTwin?.executionCapacity?.classification;
  if (!classification) {
    return "Impacto da execução no valuation não disponível neste relatório.";
  }
  if (classification === "HIGH") {
    return "A alta capacidade de execução reforça a confiança na materialização da estratégia.";
  }
  if (classification === "MODERATE") {
    return "A capacidade de execução moderada exige disciplina gerencial para sustentar criação de valor.";
  }
  return "A baixa capacidade de execução pode limitar a materialização de valor estratégico.";
}

function buildMemoryValuationImpact(
  input: ValuationIntelligenceInput,
): string {
  if (!input.governanceMemory) {
    return "Impacto da memória institucional no valuation não disponível neste relatório.";
  }
  if (input.governanceMemory.institutionalLearnings.length > 0) {
    return "A existência de aprendizados institucionais fortalece a capacidade de evolução governada.";
  }
  return "A memória institucional ainda carece de aprendizados suficientes para suportar leitura de valuation.";
}

function buildValuationNarrative(
  readiness: ValuationReadinessClassification,
  signals: ValuationImpactSignal[],
  risks: ValuationRiskSignal[],
): string {
  return `A prontidão para valuation foi classificada como ${readiness}, com ${signals.length} sinais de criação de valor e ${risks.length} riscos de destruição de valor identificados.`;
}

function buildValuationAttentionPoints(
  input: ValuationIntelligenceInput,
): string[] {
  const points: string[] = [];
  if (!input.unifiedFinancialNarrative) {
    points.push("Consolidar narrativa financeira unificada antes de avançar para valuation formal.");
  }
  if (!input.esgIntelligence) {
    points.push("Estruturar leitura ESG antes de avançar para valuation institucional.");
  }
  if (!input.governanceDigitalTwin) {
    points.push("Consolidar simulação institucional antes de avaliar impacto de execução no valuation.");
  }
  if ((input.governanceIntelligence?.persistentRisks?.length ?? 0) > 0) {
    points.push("Tratar riscos persistentes antes de uma leitura de valuation mais robusta.");
  }
  return points;
}

export function buildValuationIntelligence(
  input: ValuationIntelligenceInput | undefined,
): ValuationIntelligence | undefined {
  if (!input) {
    return undefined;
  }

  const hasEvidence =
    input.unifiedFinancialNarrative ||
    input.executiveFinancialStory ||
    input.governanceIntelligence ||
    input.governanceDigitalTwin ||
    input.esgIntelligence ||
    input.governanceMemory;

  if (!hasEvidence) {
    return undefined;
  }

  const valueCreationSignals = buildValueCreationSignals(input);
  const valueDestructionRisks = buildValueDestructionRisks(input);
  const governanceValuationImpact = buildGovernanceValuationImpact(input);
  const esgValuationImpact = buildEsgValuationImpact(input);
  const executionValuationImpact = buildExecutionValuationImpact(input);
  const memoryValuationImpact = buildMemoryValuationImpact(input);
  const valuationReadiness = classifyValuationReadiness(input);

  return {
    valuationReadiness,
    valueCreationSignals,
    valueDestructionRisks,
    governanceValuationImpact,
    esgValuationImpact,
    executionValuationImpact,
    memoryValuationImpact,
    valuationNarrative: buildValuationNarrative(
      valuationReadiness,
      valueCreationSignals,
      valueDestructionRisks,
    ),
    valuationAttentionPoints: buildValuationAttentionPoints(input),
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
