import type {
  BenchmarkGap,
  BenchmarkIntelligence,
  BenchmarkIntelligenceInput,
  BenchmarkPosition,
  CompetitiveAdvantage,
} from "./benchmark-intelligence-types";

const FIDUCIARY_DISCLAIMER =
  "Esta camada de Benchmark produz posicionamentos institucionais baseados exclusivamente em evidências internas da arquitetura de governança, sem consumir ou comparar dados financeiros de mercado, garantindo 100% de precisão e isolamento.";

function calculateGovernancePosition(input: BenchmarkIntelligenceInput): BenchmarkPosition {
  if (!input.governanceIntelligence) return "EARLY";
  
  const eff = input.governanceIntelligence.decisionEffectiveness.effectivenessRatio;
  const frictions = input.governanceIntelligence.governanceFrictions.length;
  const persistentRisks = input.governanceIntelligence.persistentRisks.length;

  if (eff >= 0.8 && frictions === 0 && persistentRisks === 0) return "LEADING";
  if (eff >= 0.5 && frictions <= 2) return "ADVANCED";
  if (eff >= 0.3) return "DEVELOPING";
  return "EARLY";
}

function calculateExecutionPosition(input: BenchmarkIntelligenceInput): BenchmarkPosition {
  const cap = input.governanceDigitalTwin?.executionCapacity.classification;
  if (cap === "HIGH") return "LEADING";
  if (cap === "MODERATE") return "ADVANCED";
  if (!input.governanceDigitalTwin) return "EARLY";
  return "DEVELOPING";
}

function calculateESGPosition(input: BenchmarkIntelligenceInput): BenchmarkPosition {
  const score = input.esgIntelligence?.overallScore;
  if (score === undefined) return "EARLY";
  if (score >= 80) return "LEADING";
  if (score >= 60) return "ADVANCED";
  if (score >= 40) return "DEVELOPING";
  return "EARLY";
}

function calculateValuationPosition(input: BenchmarkIntelligenceInput): BenchmarkPosition {
  const readiness = input.valuationIntelligence?.valuationReadiness;
  if (readiness === "HIGH") return "LEADING";
  if (readiness === "MODERATE") return "ADVANCED";
  if (readiness === "LOW") return "DEVELOPING";
  return "EARLY";
}

function buildInstitutionalPosition(
  gov: BenchmarkPosition,
  exec: BenchmarkPosition,
  esg: BenchmarkPosition,
  val: BenchmarkPosition
): BenchmarkPosition {
  const positions = [gov, exec, esg, val];
  const count = (pos: BenchmarkPosition) => positions.filter(p => p === pos).length;

  if (count("LEADING") >= 3) return "LEADING";
  if (count("LEADING") + count("ADVANCED") >= 3) return "ADVANCED";
  if (count("EARLY") >= 3) return "EARLY";
  return "DEVELOPING";
}

function buildGaps(
  input: BenchmarkIntelligenceInput,
  gov: BenchmarkPosition,
  exec: BenchmarkPosition,
  esg: BenchmarkPosition,
  val: BenchmarkPosition
): BenchmarkGap[] {
  const gaps: BenchmarkGap[] = [];

  if (gov === "EARLY" || gov === "DEVELOPING") {
    gaps.push({ category: "Governance", description: "Persistent Governance Risks or low effectiveness." });
  }
  if (exec === "EARLY" || exec === "DEVELOPING") {
    gaps.push({ category: "Execution", description: "Low Execution Capacity limiting strategy materialization." });
  }
  if (esg === "EARLY" || esg === "DEVELOPING") {
    gaps.push({ category: "ESG", description: "ESG Deficiencies compared to expected baseline." });
  }
  if (val === "EARLY" || val === "DEVELOPING") {
    gaps.push({ category: "Valuation", description: "Low Valuation Readiness." });
  }
  
  if (input.governanceIntelligence && input.governanceIntelligence.governanceFrictions.length > 0) {
    gaps.push({ category: "Friction", description: "Institutional Friction is present and recurring." });
  }

  return gaps;
}

function buildAdvantages(
  input: BenchmarkIntelligenceInput,
  gov: BenchmarkPosition,
  exec: BenchmarkPosition,
  esg: BenchmarkPosition,
  val: BenchmarkPosition
): CompetitiveAdvantage[] {
  const adv: CompetitiveAdvantage[] = [];

  if (gov === "LEADING") adv.push({ category: "Governance", advantage: "High Decision Effectiveness" });
  if (exec === "LEADING") adv.push({ category: "Execution", advantage: "High Execution Capacity" });
  if (esg === "LEADING") adv.push({ category: "ESG", advantage: "High ESG Readiness" });
  if (val === "LEADING") adv.push({ category: "Valuation", advantage: "High Valuation Readiness" });

  if (input.governanceMemory && input.governanceMemory.institutionalLearnings.length > 0) {
    adv.push({ category: "Memory", advantage: "Strong Institutional Learning" });
  }

  return adv;
}

function buildNarrative(position: BenchmarkPosition, gapsCount: number, advCount: number): string {
  return `A organização apresenta posicionamento institucional ${position}, sustentado por ${advCount} diferenciais competitivos mapeados. Persistem ${gapsCount} gaps críticos que representam oportunidades de fortalecimento para ampliar a prontidão nos próximos ciclos de crescimento.`;
}

function buildAttentionPoints(gaps: BenchmarkGap[]): string[] {
  return gaps.map(g => `Focar no fechamento de gap em ${g.category}: ${g.description}`);
}

export function buildBenchmarkIntelligence(
  input: BenchmarkIntelligenceInput | undefined,
): BenchmarkIntelligence | undefined {
  if (!input) {
    return undefined;
  }

  const hasEvidence =
    input.unifiedFinancialNarrative ||
    input.governanceIntelligence ||
    input.governanceDigitalTwin ||
    input.esgIntelligence ||
    input.valuationIntelligence ||
    input.governanceMemory;

  if (!hasEvidence) {
    return undefined;
  }

  const governancePosition = calculateGovernancePosition(input);
  const executionPosition = calculateExecutionPosition(input);
  const esgPosition = calculateESGPosition(input);
  const valuationPosition = calculateValuationPosition(input);

  const institutionalPosition = buildInstitutionalPosition(
    governancePosition,
    executionPosition,
    esgPosition,
    valuationPosition
  );

  const institutionalGaps = buildGaps(input, governancePosition, executionPosition, esgPosition, valuationPosition);
  const competitiveAdvantages = buildAdvantages(input, governancePosition, executionPosition, esgPosition, valuationPosition);

  const benchmarkNarrative = buildNarrative(institutionalPosition, institutionalGaps.length, competitiveAdvantages.length);
  const benchmarkAttentionPoints = buildAttentionPoints(institutionalGaps);

  return {
    institutionalPosition,
    governancePosition,
    executionPosition,
    valuationPosition,
    esgPosition,
    institutionalGaps,
    competitiveAdvantages,
    benchmarkNarrative,
    benchmarkAttentionPoints,
    fiduciaryDisclaimer: FIDUCIARY_DISCLAIMER,
  };
}
